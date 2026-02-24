import GenerateLocalID from '../Common/GenerateLocalID';
import DocLib from '../Documents/DocumentLibrary';
import DocumentValidation from '../Documents/DocumentValidation';
import IsCompleteAction from '../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';
import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import Logger from '../Log/Logger';
import GetNotificationItemStepData from './CreateUpdate/GetNotificationItemStepData';

/**
* Run all actions pertaining to Malfunction End/Work Order Complete
* @param {IClientAPI} context
*/
export default async function MalfunctionEnd(context) {

    const formCellContainer = context.getControl('FormCellContainer');
    //Description and list picker field values for Notification Item and Cause Item creation
    const itemDescription = context.evaluateTargetPath('#Control:ItemDescription/#Value') ?? '';
    const causeDescription = context.evaluateTargetPath('#Control:CauseDescription/#Value') ?? '';
    const [objectPartCodeGroup, objectPart, codeGroup, damageCode, causeCodeGroup, cause ] = [
        'PartGroupLstPkr', 'PartDetailsLstPkr','DamageGroupLstPkr', 'DamageDetailsLstPkr', 'CauseGroupLstPkr', 'CodeLstPkr']
        .map (controlName => formCellContainer.getControl(controlName)?.getValue())   
        .map(pickedItems => ValidationLibrary.evalIsEmpty(pickedItems) ? '' : pickedItems[0].ReturnValue);
    let notificationItemData = [];
     // Handle item note creation if applicable
    const itemNote = context.evaluateTargetPath('#Control:ItemNote/#Value') ?? '';
    const itemStepData = await GetNotificationItemStepData(context);
    let notificationItem = {
        itemDescription,
        objectPartCodeGroup,
        objectPart,
        codeGroup,
        damageCode,
        itemNote,
        causeDescription,
        causeCodeGroup,
        cause,
    };
   
    return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationUpdateMalfunctionEnd.action').then(actionResult => {
        try {
            notificationItemData.push(JSON.parse(actionResult?.data)['@odata.readLink']);
            if (itemDescription || (objectPartCodeGroup && objectPart) || (codeGroup && damageCode)) {
                return  updateNotificationItem(context, actionResult, notificationItem, itemStepData);
            } else {
                // Resolve promise but don't pass an action result
                return Promise.resolve();
            }
        } catch (err) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), 'MalfunctionEnd.js: Error in NotificationUpdateMalfunctionEnd action', err);
            return Promise.resolve();
        }   
    }).then(actionResult => {
        let itemResult = null;
        let itemNoteResult = null;
        try {
            [itemResult, itemNoteResult] = actionResult;
            notificationItemData.push(JSON.parse(itemResult?.data)['@odata.readLink']);
            if (itemNoteResult) {
                notificationItemData.push(JSON.parse(itemNoteResult?.data)['@odata.readLink']);
            }
        } catch (err) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), 'MalfunctionEnd.js: Error in Notification Create Item action', err);
            return Promise.resolve();        
        }
        // If actionResult is null, no don't create a Cause
        if ((causeDescription || (causeCodeGroup && cause)) && itemResult ) {
            return  updateNotificationItemCause(context, itemResult, notificationItem, itemStepData);
        } else {
            return Promise.resolve();
        }
    }).then((actionResult) => {
        try {
            notificationItemData.push(JSON.parse(actionResult?.data)['@odata.readLink']);
            return Promise.resolve();
        } catch (err) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), 'MalfunctionEnd.js: Error in Notification Create Cause action', err);
            return Promise.resolve();
        }  
    }).then(() => {
        //Update attachments -- Copied verbatim from DocumentCreateDelete.js because
        //the success message hardcoded into the rule screws things up

        //*************DELETE DOCUMENTS *********************
        const attachmentFormcell = context.getControl('FormCellContainer').getControl('Attachment');
        const deletedAttachments = attachmentFormcell.getClientData().DeletedAttachments;
        // create an rray with all the readLinks to process
        context.getClientData().DeletedDocReadLinks = deletedAttachments.map((deletedAttachment) => {
            return deletedAttachment.readLink;
        });

        let deletes = deletedAttachments.map(() => {
            //call the delete doc delete action
            return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentDeleteBDS.action');
        });
        return Promise.all(deletes).then(() => {
            //*************CREATE DOCUMENTS *********************/
            const attachmentCount = DocLib.validationAttachmentCount(context);
            if (attachmentCount > 0) {
                return DocumentValidation(context, '', attachmentFormcell).then(() => {
                    return Promise.resolve(); // Explicitly return a value
                });
            }
            return Promise.resolve(); // Explicitly return a value if no attachments
        });
    }).then(() => {
        if (IsCompleteAction(context)) {
            let itemLinks = WorkOrderCompletionLibrary.getStep(context, 'notification').itemLinks || [];
            if (notificationItemData) {
                itemLinks = [...new Set([...notificationItemData, ...itemLinks])];
            }
            WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                    data: JSON.stringify(context.binding),
                    value: context.localizeText('done'),
                    link: context.binding['@odata.editLink'],
                    itemLinks: itemLinks,
                });

                return WorkOrderCompletionLibrary.getInstance().openMainPage(context);
        }
        return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action');
    }).catch((err) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), 'MalfunctionEnd.js: Error in final action', err);
        // Failure occurred
        return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
    });
}

export async function updateNotificationItem(context, actionResult, notificationItem, itemStepData) {
    const data = JSON.parse(actionResult.data);
    const readLink = itemStepData?.Item && Object.keys(itemStepData.Item).length > 0 ? itemStepData.Item['@odata.readLink'] : '';
    const isCreate = !readLink; // If readLink is empty, we are creating a new item
    const actionType = isCreate ? 'Create' : 'Update';
    let itemNoteResult = null;
    const target = {
        'EntitySet': 'MyNotificationItems',
        'Service': '/SAPAssetManager/Services/AssetManager.service',
    };
    const header = {
        'OfflineOData.TransactionID': data.NotificationNumber,
    };

    // Prepare properties common for both create and update
    let properties = {
        ItemText: notificationItem.itemDescription,
        ObjectPartCodeGroup: notificationItem.objectPartCodeGroup,
        ObjectPart: notificationItem.objectPart,
        CodeGroup: notificationItem.codeGroup,
        DamageCode: notificationItem.damageCode,
    };

    if (isCreate) {
        // Generate local IDs for a new item
        const localItemNum = await GenerateLocalID(context, `${data['@odata.readLink']}/Items`, 'ItemNumber', '0000', '', '');
        const sortNum = await GenerateLocalID(context, `${data['@odata.readLink']}/Items`, 'ItemSortNumber', '0000', '', '');

        properties.NotificationNumber = data.NotificationNumber;
        properties.ItemNumber = localItemNum;
        properties.ItemSortNumber = sortNum;

        header['OfflineOData.RemoveAfterUpload'] = '/SAPAssetManager/Rules/Common/RemoveAfterUploadValue.js';

    } else {
        // Update action
        target.ReadLink = readLink;
    }

    const itemResult = await context.executeAction({
        'Name': `/SAPAssetManager/Actions/Notifications/Item/NotificationItem${actionType}.action`,
        'Properties': isCreate ? {
            'Properties': properties,
            'Target': target,
            'Headers': header,
            'OnSuccess': '',
            'OnFailure': '',
        } : {
            'Properties': properties,
            'Target': target,
            'OnSuccess': '',
            'OnFailure': '',
            'Headers': header,
        },
    });

    // If creating, handle item note if provided
    if (isCreate && notificationItem.itemNote) {
        const itemData = JSON.parse(itemResult.data);
        itemNoteResult = await context.executeAction({
            'Name': '/SAPAssetManager/Actions/Notes/NoteCreateDuringEntityCreate.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'MyNotifItemLongTexts',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                },
                'Properties': {
                    'NewTextString': notificationItem.itemNote,
                    'TextString': notificationItem.itemNote,
                },
                'Headers': {
                    'OfflineOData.RemoveAfterUpload': '/SAPAssetManager/Rules/Common/RemoveAfterUploadValue.js',
                },
                'OnSuccess': '',
                'OnFailure': '',
                'CreateLinks': [{
                    'Property': 'NotificationItem',
                    'Target': {
                        'EntitySet': 'MyNotificationItems',
                        'ReadLink': itemData['@odata.readLink'],
                    },
                }],
            },
        });
    }

    return [itemResult, itemNoteResult];
}
export async function updateNotificationItemCause(context, actionResult, notificationItemCause, itemStepData) {
    const data = JSON.parse(actionResult.data);

    const readLink = itemStepData?.Cause && Object.keys(itemStepData.Cause).length > 0 ? itemStepData.Cause['@odata.readLink'] : '';
    const isCreate = !readLink; // If readLink is empty, we are creating a new item
    const actionType = isCreate ? 'Create' : 'Update';
    let causeNoteResult = null;
    const target = {
        'EntitySet': 'MyNotificationItemCauses',
        'Service': '/SAPAssetManager/Services/AssetManager.service',
    };
    const header = {
        'OfflineOData.TransactionID': data.NotificationNumber,
    };

    // Prepare properties common for both create and update
    let properties = {
        CauseText: notificationItemCause.causeDescription,
        CauseCodeGroup: notificationItemCause.causeCodeGroup,
        CauseCode: notificationItemCause.cause,
       
    };

    if (isCreate) {
        // Generate local IDs for a new item
        let localCauseNum = await GenerateLocalID(context, `${data['@odata.readLink']}/ItemCauses`, 'CauseSequenceNumber', '0000', '', '');
        let sortNum = await GenerateLocalID(context, `${data['@odata.readLink']}/ItemCauses`, 'CauseSortNumber', '0000', '', '');

        properties.NotificationNumber = data.NotificationNumber;
        properties.ItemNumber = data.ItemNumber;
        properties.CauseSequenceNumber = localCauseNum;
        properties.CauseSortNumber = sortNum;

        header['OfflineOData.RemoveAfterUpload'] = '/SAPAssetManager/Rules/Common/RemoveAfterUploadValue.js';

    } else {
        // Update action
        target.ReadLink = readLink;
    }
    const causeResult = await context.executeAction({
        'Name': `/SAPAssetManager/Actions/Notifications/Item/NotificationItemCause${actionType}.action`,
        'Properties': isCreate ? {
            'Properties': properties,
            'Target': target,
            'Headers': header,
            'OnSuccess': '',
            'OnFailure': '',
            'CreateLinks':
            [{
                'Property' : 'Item',
                'Target':
                {
                    'EntitySet' : 'MyNotificationItems',
                    'ReadLink' : data['@odata.readLink'],
                },
            }],
        } : {
            'Properties': properties,
            'Target': target,
            'OnSuccess': '',
            'OnFailure': '',
            'Headers': header,

        },
    });

    // If creating, handle item note if provided
    if (isCreate && notificationItemCause.causeNote) {
        const causeData = JSON.parse(causeResult.data);
        causeNoteResult = await context.executeAction({
            'Name': '/SAPAssetManager/Actions/Notes/NoteCreateDuringEntityCreate.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'MyNotifItemCauseLongTexts',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                },
                'Properties': {
                    'NewTextString': notificationItemCause.causeNote,
                    'TextString': notificationItemCause.causeNote,
                },
                'Headers': {
                    'OfflineOData.RemoveAfterUpload': '/SAPAssetManager/Rules/Common/RemoveAfterUploadValue.js',
                },
                'OnSuccess': '',
                'OnFailure': '',
                'CreateLinks': [{
                    'Property': 'NotificationItemCause',
                    'Target': {
                        'EntitySet': 'MyNotificationItemCauses',
                        'ReadLink': causeData['@odata.readLink'],
                    },
                }],
            },
        });
    }

    return [causeResult, causeNoteResult];
}
