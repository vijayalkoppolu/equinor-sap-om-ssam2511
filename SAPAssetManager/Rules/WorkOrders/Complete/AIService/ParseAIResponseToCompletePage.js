import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { NoteLibrary as NoteLib } from '../../../Notes/NoteLibrary';
import SetWOExpenseVisible from '../Expenses/SetWOExpenseVisible';
import SetWOMileageVisible from '../Mileage/SetWOMileageVisible';
import Logger from '../../../Log/Logger';
import GenerateLocalConfirmationNum from '../../../Confirmations/CreateUpdate/OnCommit/GenerateLocalConfirmationNum';
import GenerateConfirmationCounter from '../../../Confirmations/CreateUpdate/OnCommit/GenerateConfirmationCounter';
import { countExpenses } from '../Expenses/ChangeExpensesFinalize';
import { combineExpenses } from '../Expenses/ChangeExpensesFinalize';
import GetCurrentDate from '../../../Confirmations/BlankFinal/GetCurrentDate';
import ConvertMinutesToHourString from '../../../Confirmations/ConvertMinutesToHourString';
import ODataDate from '../../../Common/Date/ODataDate';
import { CalculateEndDateTime } from '../../../Confirmations/CreateUpdate/OnCommit/GetEndDateTime';
import { getContextObjects } from '../../../TimeSheets/Entry/CreateUpdate/TimeSheetEntryCreateUpdateOnPageLoadForWO';
import TimeSheetGetPersonnelNumber from '../../../TimeSheets/CreateUpdate/TimeSheetGetPersonnelNumber';
import ConvertDoubleToHourString from '../../../Confirmations/ConvertDoubleToHourString';
import SetWONoteVisible from '../Note/SetWONoteVisible';
import GenerateTimeEntryID from '../../../TimeSheets/GenerateTimeEntryID';
import { Application } from '@nativescript/core';
import { MergeDateAndTime } from '../../../Confirmations/CreateUpdate/OnCommit/GetStartDateTime';
import { updateNotificationItem, updateNotificationItemCause } from '../../../Notifications/MalfunctionEnd';
import GetNotificationItemStepData from '../../../Notifications/CreateUpdate/GetNotificationItemStepData';
import SetWONotificationVisible from '../Notification/SetWONotificationVisible';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import { prepareForNoteUpdate } from '../Note/ChangeNote';
import ConfirmationCreateIsEnabled from '../../../Confirmations/CreateUpdate/ConfirmationCreateIsEnabled';
import TimeSheetCreateIsEnabled from '../../../TimeSheets/TimeSheetCreateIsEnabled';
export default async function ParseAIResponseToCompletePage(context, aiResponse) {
    const summaryJson = aiResponse;
    const expense = summaryJson.expense;
    const mileage = summaryJson.mileage;
    const note = summaryJson.note;
    const orderId = context.binding.OrderId || context.binding.OrderID;
    const operation = summaryJson.operation?.id || context.binding.OperationNo;
    const time = summaryJson.time;
    const notificationItem = summaryJson.notificationItem;
    let pageProxy = context.getPageProxy();
    let shouldSetBinding = false;
    try {
        if (expense && SetWOExpenseVisible(context)) {
            await updateExpense(context, expense, orderId, operation);
        }
        if (mileage && SetWOMileageVisible(context)) {
            await updateMileage(context, mileage, orderId, operation);
        }
        if (time) {
            if (ConfirmationCreateIsEnabled(context)) {
                await updateTime(context, time, orderId, operation);
            } else if (TimeSheetCreateIsEnabled(context)) {
                await updateCATS(context, time, orderId, operation);
            }
        }
        if (note && SetWONoteVisible(context)) {
            await updateNotes(context, note, orderId, operation);
        }
        // Update notification item and cause, make sure this is the last item to update
        if (notificationItem && SetWONotificationVisible(context)) {
            shouldSetBinding = true;
            pageProxy._context.binding = WorkOrderCompletionLibrary.getStepData(pageProxy, 'notification');
            const [itemPromise, notification] = await updateItem(pageProxy, notificationItem);
            await updateCause(pageProxy, itemPromise, notification);
        }
    } catch (error) {
        Logger.error('AI Flow error:', error);
        if (Application.ios) { // redrawPageSection API crashes on iOS
            context.getPageProxy().getControl('SectionedTable').getSection('OptionalSection').redraw();
            context.getPageProxy().getControl('SectionedTable').getSection('MandatorySection').redraw();
        } else {
            CommonLibrary.redrawPageSection(context, 'CompleteOrderScreen', 'SectionedTable');
        }
        throw new Error('AI Flow error:', error);
    } finally {
        if (shouldSetBinding) {
            pageProxy._context.binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
        }
        context.dismissActivityIndicator();
    }
    context.executeAction('/SAPAssetManager/Actions/AIService/AICompletionSuccess.action');
    if (Application.ios) {
        context.getPageProxy().getControl('SectionedTable').getSection('OptionalSection').redraw();
        context.getPageProxy().getControl('SectionedTable').getSection('MandatorySection').redraw();
    } else {
        CommonLibrary.redrawPageSection(context, 'CompleteOrderScreen', 'SectionedTable');
    }
}

async function updateNotes(context, note, orderId, operation) {
    const existingNote = await prepareForNoteUpdate(context);
    const isHeader = ['Header'].includes(CommonLibrary.getWorkOrderAssnTypeLevel(context));
    const hasExistingNote = existingNote !== null;
    const actionType = hasExistingNote ? 'Update' : 'Create';
    const actionTarget = isHeader ? 'WO' : 'WOOperation';
    const properties = {
        NewTextString: note.content,
    };
    if (hasExistingNote) {
        properties.NewTextString = note.actionType === 'Create' ?
            NoteLib.prependNoteText(existingNote?.NewTextString, note.content) :
            note.content;
        properties.TextString = NoteLib.prependNoteText(existingNote?.TextString, note.content);
    } else {
        properties.TextString = note.content;
    }
    let actionLinks = [];
    if (actionTarget === 'WO') {
        properties.OrderId = orderId;
        actionLinks.push({
            'Property': 'WorkOrderHeader',
            'Target': {
                'EntitySet': 'MyWorkOrderHeaders',
                'ReadLink': `MyWorkOrderHeaders('${orderId}')`,
            },
        });
    } else if (actionTarget === 'WOOperation') {
        properties.OrderId = orderId;
        properties.OperationNo = operation;
        actionLinks.push({
            'Property': 'WorkOrderOperation',
            'Target': {
                'EntitySet': 'MyWorkOrderOperations',
                'ReadLink': `MyWorkOrderOperations(OrderId='${orderId}',OperationNo='${operation}')`,
            },
        });
    }
    
    const noteUpdateAction = context.executeAction({
        'Name': `/SAPAssetManager/Actions/Notes/${actionType}/Notes${actionType}On${actionTarget}.action`,
        'Properties': { 
            'Properties': {
                ...properties,
            },
            'OnSuccess': '',
            [actionType + 'Links']: actionLinks,
        },
    }).then((result) => {
        WorkOrderCompletionLibrary.updateStepState(context, 'note', {
            data: result.data,
            link: JSON.parse(result.data)['@odata.editLink'],
            value: note.content,
        });
    }).catch((error) => {
        Logger.error('Note Create Action Error ' + error);
        throw new Error('Note Create Action Error ' + error);
    });
    return noteUpdateAction;

}
async function updateExpense(context, expense, orderId, operation) {
    const confirmationNum = await GenerateLocalConfirmationNum(context);
    const confirmationCounter = await GenerateConfirmationCounter(context);
    const isCreate = (expense.actionType || 'Create') === 'Create';
    const actionType = isCreate ? 'Create' : 'Update';
    const readLink = WorkOrderCompletionLibrary.getStepDataLink(context, 'expenses');
    const target = {
        'EntitySet': 'Confirmations',
        'Service': '/SAPAssetManager/Services/AssetManager.service',
    };
    const properties = {
        Operation: operation,
        OrderID: orderId,
        Description: expense.comment || '',
        WorkCenter: CommonLibrary.getExpenseWorkCenter(context),
        ActualWork: expense.amount || 0,
        CreatedDate: GetCurrentDate(context),
        StartDate: GetCurrentDate(context),
        FinishDate: GetCurrentDate(context),
        PostingDate: GetCurrentDate(context),
        ActivityType: CommonLibrary.getExpenseActivityType(context),
    };
    if (isCreate) {
        properties.ConfirmationNum = confirmationNum;
        properties.ConfirmationCounter = confirmationCounter;
        properties .ActivityType = CommonLibrary.getExpenseActivityType(context);
        properties.WorkCenter = CommonLibrary.getExpenseWorkCenter(context);
        properties.Plant = await CommonLibrary.getPlantFromWorkCenter(context, CommonLibrary.getExpenseWorkCenter(context)) || ''; 
    } else {
        target.ReadLink = readLink;
    }
    const expenseCreateAction = context.executeAction({
        'Name': `/SAPAssetManager/Actions/Expense/Expense${actionType}.action`,
        'Properties': { 
            'Properties': {
                ...properties,
            },
            'OnSuccess': '',
            'Headers': {
                'OfflineOData.TransactionID':  isCreate ? confirmationNum : WorkOrderCompletionLibrary.getStep(context, 'expenses').confirmationNum || confirmationNum,
            },
            'Target': target,
            [actionType + 'Links']: [{                
                'Property': 'WorkOrderHeader',
                'Target':
                {
                    'EntitySet': 'MyWorkOrderHeaders',
                    'ReadLink': `MyWorkOrderHeaders('${orderId}')`,
                },
            },
            {
                'Property': 'WorkOrderOperation',
                'Target': {
                    'EntitySet': 'MyWorkOrderOperations',
                    'ReadLink': `MyWorkOrderOperations(OrderId='${orderId}',OperationNo='${operation}')`,
                },
            }],
        },
    }).then((result) => {
        let savedExpenses = CommonLibrary.getStateVariable(context, 'expenses') || [];
        const expensesMap = new Map(savedExpenses.map(exp => [exp.localConfirmationNum, exp]));
        const newExpense = JSON.parse(result.data);
        expensesMap.set(newExpense.ConfirmationNum, {
            localConfirmationCounter: newExpense.ConfirmationCounter,
            localConfirmationNum: newExpense.ConfirmationNum,
            actualWork: newExpense.ActualWork,
        });
     
        savedExpenses = Array.from(expensesMap.values());   
        CommonLibrary.setStateVariable(context, 'expenses', savedExpenses);
        let data = {};
        data.value = combineExpenses(context, savedExpenses);
        data.count = countExpenses(savedExpenses);
        data.confirmationNum = JSON.parse(result.data).ConfirmationNum; // store last confirmation number
        data.link = JSON.parse(result.data)['@odata.id'];
        WorkOrderCompletionLibrary.updateStepState(context, 'expenses', data);

    }).catch((error) => {
        Logger.error('ExpenseCreate Action Error ' + error);
        throw new Error('ExpenseCreate Action Error ' + error); 
    });
    return expenseCreateAction;
}
async function updateMileage(context, mileage, orderId, operation) {
    const confirmationNum = await GenerateLocalConfirmationNum(context);
    const confirmationCounter = await GenerateConfirmationCounter(context);
    const readLink = WorkOrderCompletionLibrary.getStepDataLink(context, 'mileage');
    const data = WorkOrderCompletionLibrary.getStepData(context, 'mileage');
    const isCreate = readLink === '';
    const actionType = isCreate ? 'Create' : 'Update';
    const actionName = isCreate ? 'Add' : 'Edit';
    const target = {
        'EntitySet': 'Confirmations',
        'Service': '/SAPAssetManager/Services/AssetManager.service',
    };
    const totalMileage = mileage.number ||  WorkOrderCompletionLibrary.getStepValue(context, 'mileage')*60 || 0;

    
    const properties = {
        Operation: operation,
        OrderID: orderId,
        WorkCenter: CommonLibrary.getMileageWorkCenter(context),
        Plant: await CommonLibrary.getPlantFromWorkCenter(context, CommonLibrary.getMileageWorkCenter(context)) || '',
        ActualWork: totalMileage,
        CreatedDate: GetCurrentDate(context),
        PostingDate: GetCurrentDate(context),
        Description: mileage.comment || '',
        StartDate: new ODataDate(mileage.date).toDBDateString(context) || data?.StartDate || GetCurrentDate(context),
       
    };
    if (isCreate) {
        properties.ConfirmationNum = confirmationNum;
        properties.ConfirmationCounter = confirmationCounter;
    } else {
        target.ReadLink = readLink;
    }
    
    const mileageAddAction = context.executeAction({
        'Name': `/SAPAssetManager/Actions/ServiceOrders/Mileage/Mileage${actionName}.action`,
        'Properties': { 
            'Properties': {
                ...properties,
            },
            'Target': target,
            'OnSuccess': '',
            'Headers': {
                'OfflineOData.TransactionID': isCreate ? confirmationNum : data?.ConfirmationNum || confirmationNum,
             },
             [actionType + 'Links']: [{                
                'Property': 'WorkOrderHeader',
                'Target': {
                    'EntitySet': 'MyWorkOrderHeaders',
                    'ReadLink': `MyWorkOrderHeaders('${orderId}')`,
                },
            },
            {
                'Property': 'WorkOrderOperation',
                'Target': {
                    'EntitySet': 'MyWorkOrderOperations',
                    'ReadLink': `MyWorkOrderOperations(OrderId='${orderId}',OperationNo='${operation}')`,
                },
            }],
        },
    }).then((result) => {
        const amount = mileage.number + ' km';
        WorkOrderCompletionLibrary.updateStepState(context, 'mileage', {
            value: amount,
            link: JSON.parse(result.data)['@odata.id'],
            data: result.data,
        });
    }).catch((error) => {
        Logger.error('Mileage Create Action Error ' + error);
        throw new Error('Mileage Create Action Error ' + error);
    });
    return mileageAddAction;
}
async function updateTime(context, time, orderId, operation) {
    const confirmationNum = await GenerateLocalConfirmationNum(context);
    const confirmationCounter = await GenerateConfirmationCounter(context);
    const readLink = WorkOrderCompletionLibrary.getStepDataLink(context, 'time');
    const data = WorkOrderCompletionLibrary.getStepData(context, 'time');
    const isCreate = readLink === '';
    const actionType = isCreate ? 'Create' : 'Update';
    const target = {
        'EntitySet': 'Confirmations',
        'Service': '/SAPAssetManager/Services/AssetManager.service',
    };
    
    const duration = time.duration ||  WorkOrderCompletionLibrary.getStepValue(context, 'time')*60 || 0;
    let properties = {
        ActualDuration: duration,
        ActualWork: duration,
        FinalConfirmation: time.isFinal === 'true' ? 'X' : '',
        Operation: operation,
        SubOperation: '',
        VarianceReason: '',
        AccountingIndicator: '',
        ActivityType: '',
        OrderType: context.binding.OrderType || '',
        StartDate: new ODataDate(time.date).toDBDateString(context) || data?.StartDate || GetCurrentDate(context),
        FinishDate: GetCurrentDate(context),
        FinishTime: new ODataDate(CalculateEndDateTime(MergeDateAndTime(new Date(), new Date()), duration)).toDBTimeString(context),
        OrderID: orderId,
        Plant: context.binding.MainWorkCenterPlant,
    };
    
    if (isCreate) {
        properties.ConfirmationNum = confirmationNum;
        properties.ConfirmationCounter = confirmationCounter;
    } else {
        target.ReadLink = readLink;
    }
    
    const timeUpdateAction = context.executeAction({
        'Name': `/SAPAssetManager/Actions/Confirmations/Confirmation${actionType}.action`,
        'Properties': { 
           'Properties': properties,
            'Target': target,
            'OnSuccess': '',
            'ValidationRule': '',
            'Headers': {
                'OfflineOData.TransactionID': isCreate ? confirmationNum : data?.ConfirmationNum || confirmationNum,
             },
             [actionType + 'Links']: [{                
                'Property': 'WorkOrderHeader',
                'Target': {
                    'EntitySet': 'MyWorkOrderHeaders',
                    'ReadLink': `MyWorkOrderHeaders('${orderId}')`,
                },
            },
            {
                'Property': 'WorkOrderOperation',
                'Target': {
                    'EntitySet': 'MyWorkOrderOperations',
                    'ReadLink': `MyWorkOrderOperations(OrderId='${orderId}',OperationNo='${operation}')`,
                },
            }],
        },
    }).then((result) => {
        WorkOrderCompletionLibrary.updateStepState(context, 'time', {
            data: result.data,
            link: JSON.parse(result.data)['@odata.editLink'],
            value: ConvertMinutesToHourString(duration),
            lam: '',
        });
    }).catch((error) => {
        Logger.error('Time Create Action Error ' + error);
        throw new Error('Time Create Action Error ' + error);
    });
    return timeUpdateAction;
}
async function updateCATS(context, time, orderId, operation) {
    const readLink = WorkOrderCompletionLibrary.getStepDataLink(context, 'time');
    const isHeader = ['Header'].includes(CommonLibrary.getWorkOrderAssnTypeLevel(context));
    const controllingArea = isHeader ? context.binding.ControllingArea : context.binding.WorkOrderHeader?.ControllingArea || context.binding.WOHeader?.ControllingArea;
    const isCreate = readLink === '';
    const actionType = isCreate ? 'Create' : 'Update';
    const counter = isCreate ? await GenerateTimeEntryID(context) : WorkOrderCompletionLibrary.getStepData(context, 'time').counter;
    let objects = getContextObjects(context);
    const target = {
        'EntitySet': 'CatsTimesheets',
        'Service': '/SAPAssetManager/Services/AssetManager.service',
    };
    
    const duration = (time.duration ||  WorkOrderCompletionLibrary.getStepValue(context, 'time')) / 60 || 0;
    let properties = {
        Date: GetCurrentDate(context),
        Hours: duration,
        AttendAbsenceType: '',
        ActivityType: 'TRAVEL',
        Workcenter: objects.workCenter,
        ControllerArea: controllingArea,
    };
    
    if (!isCreate) {
        target.ReadLink = readLink;
    }
    
    const timeUpdateAction = context.executeAction({
        'Name': `/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateUpdate${actionType}.action`,
        'Properties': { 
           'Properties': properties,
            'Target': target,
            'OnSuccess': '',
            'ValidationRule': '',
            'Headers': {
                'OfflineOData.TransactionID': counter,
             },
             [actionType + 'Links']: [{                
                'Property': 'MyWOHeader',
                'Target':
                {
                    'EntitySet': 'MyWorkOrderHeaders',
                    'ReadLink': `MyWorkOrderHeaders('${orderId}')`,
                },
            },
            {
                'Property': 'MyWOOperation',
                'Target': {
                    'EntitySet': 'MyWorkOrderOperations',
                    'ReadLink': `MyWorkOrderOperations(OrderId='${orderId}',OperationNo='${operation}')`,
                },
            }, 
            {
                'Property': 'Employee',
                'Target': {
                    'EntitySet': 'Employees',
                    'QueryOptions': `$filter=PersonnelNumber eq '${TimeSheetGetPersonnelNumber(context)}'`,
                },
            }, 
        ]},
    }).then((result) => {
        WorkOrderCompletionLibrary.updateStepState(context, 'time', {
            data: result.data,
            link: JSON.parse(result.data)['@odata.editLink'],
            value: ConvertDoubleToHourString(duration),
            counter: JSON.parse(result.data).Counter,
        });
    }).catch((error) => {
        Logger.error('Time Create Action Error ' + error);
        throw new Error('Time Create Action Error ' + error);
    });
    return timeUpdateAction;
}
async function updateItem(context, notificationItem) {
    let itemStepData = await GetNotificationItemStepData(context);
    let notificationItemData = [];
    const notification = {
        data: JSON.stringify(WorkOrderCompletionLibrary.getStepData(context, 'notification')),
    };

    notificationItem = {
        itemDescription: notificationItem?.itemShortText || itemStepData?.Item?.ItemText || '',
        objectPartCodeGroup: extractCode(notificationItem?.partAndGroup?.partGroup) || itemStepData?.Item?.ObjectPartCodeGroup || '',
        objectPart: extractCode(notificationItem?.partAndGroup?.part) || itemStepData?.Item?.ObjectPart || '',
        codeGroup: extractCode(notificationItem?.damageAndGroup?.damageGroup) || itemStepData?.Item?.CodeGroup || '',
        damageCode: extractCode(notificationItem?.damageAndGroup?.damage) || itemStepData?.Item?.DamageCode || '',
        itemNote: notificationItem?.itemLongText || itemStepData?.ItemLongText?.TextString || '',
        causeDescription: notificationItem?.causeShortText || itemStepData?.Cause?.CauseText || '',
        causeCodeGroup: extractCode(notificationItem?.causeAndGroup?.causeGroup) || itemStepData?.Cause?.CauseCodeGroup || '',
        cause: extractCode(notificationItem?.causeAndGroup?.cause) || itemStepData?.Cause?.CauseCode || '',
        causeNote: notificationItem?.causeLongText || itemStepData?.CauseLongText?.TextString || '',
    };

    let itemProimse = Promise.resolve(); 

    // Create or update notification item without checking itemResult
    if (notificationItem.itemDescription || (notificationItem.objectPartCodeGroup && notificationItem.objectPart) || (notificationItem.codeGroup && notificationItem.damageCode)) {
        itemProimse = updateNotificationItem(context, notification, notificationItem, itemStepData).then(itemActionResult => {
            const [itemResult, itemNoteResult] = itemActionResult;

            notificationItemData.push(JSON.parse(notification.data)['@odata.readLink']);
            notificationItemData.push(JSON.parse(itemResult.data)['@odata.readLink']);
            if (itemNoteResult) {
                notificationItemData.push(JSON.parse(itemNoteResult.data)['@odata.readLink']);
            }
            let itemLinks = WorkOrderCompletionLibrary.getStep(context, 'notification').itemLinks || [];
            if (notificationItemData.length) {
            itemLinks = [...new Set([...notificationItemData, ...itemLinks])];
            }
            WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                value: context.localizeText('done'),
                itemLinks: itemLinks,
            });
            return itemResult;
        }).catch(error => {
            Logger.error('Error updating notification item', error);
            throw new Error('Error updating notification item', error);
        });
    }
    return [itemProimse, notificationItem];
}
async function updateCause(context, updatedItemPromise, notificationItem) {
    let notificationItemData = [];
    let itemStepData = await GetNotificationItemStepData(context);

    // Update cause only if an item exists or was just created
    const causePromise = updatedItemPromise.then(async (itemResult) => {
        if (itemResult && (notificationItem.causeDescription || (notificationItem.causeCodeGroup && notificationItem.cause))) {
            return updateNotificationItemCause(context, itemResult, notificationItem, itemStepData).then(causeActionResult => {
                const [causeResult, causeNoteResult] = causeActionResult;
                notificationItemData.push(JSON.parse(causeResult.data)['@odata.readLink']);
                if (causeNoteResult) {
                    notificationItemData.push(JSON.parse(causeNoteResult.data)['@odata.readLink']);
                }
                let itemLinks = WorkOrderCompletionLibrary.getStep(context, 'notification').itemLinks || [];
                if (notificationItemData.length) {
                itemLinks = [...new Set([...notificationItemData, ...itemLinks])];
                }
                WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                    value: context.localizeText('done'),
                    itemLinks: itemLinks,
                });
            }).catch(error => {
                Logger.error('Error updating notification cause', error);
                throw new Error('Error updating notification cause', error);
            });
        }
        return Promise.resolve();
    }).catch(error => {
        Logger.error('Error updating notification item', error);
        throw new Error('Error updating notification item', error);
    });
    return causePromise;
}
function extractCode(input) {
    if (ValidationLibrary.evalIsEmpty(input)) {
        return undefined;
    }
    // Trim the input to remove leading and trailing spaces
    const trimmedInput = input.trim();
    return trimmedInput.includes('-') ? trimmedInput.split('-')[0].trim() : trimmedInput;
}
