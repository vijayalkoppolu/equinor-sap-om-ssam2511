import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import IsServiceOrderLevel from '../ServiceOrders/IsServiceOrderLevel';
import Logger from '../Log/Logger';
import CommonLibrary from '../Common/Library/CommonLibrary';
import IsFSMIntegrationEnabled from '../ComponentsEnablement/IsFSMIntegrationEnabled';
import MyWorkSectionFSMFilterQuery from './MyWorkSection/MyWorkSectionFSMFilterQuery';
import IsOperationLevelAssigmentType from '../WorkOrders/Operations/IsOperationLevelAssigmentType';
import IsSubOperationLevelAssigmentType from '../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import FSMCrewLibrary from '../Crew/FSMCrewLibrary';
// Handle events for FSM and S4 Calendar
// Will go through the calendar and see if any WO, Op, or SubOp icons are needed
export default function FSMCalendarEvents(context) {
    if (IsS4ServiceIntegrationEnabled(context)) {
        return S4CalendarEvents(context);
    } else {
        return CSCalendarEvents(context);
    }
}

function S4CalendarEvents(context) {
    const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const today = new Date();
    let expand = '$expand=MobileStatus_Nav';
    let entitySet;
    let eventArray = [];
    if (IsServiceOrderLevel(context)) {
        entitySet = 'S4ServiceOrders';
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], expand).then(results => {
            results.slice().forEach((entry) => {
                S4CalendarEventsArray(context, eventArray, entry, today, COMPLETED);
            });
            return eventArray;
        }).catch(error =>{
            Logger.error(error);
            return [];
        });
    } else {
        entitySet = 'S4ServiceItems';
        let filter = '$filter=' + FSMCrewLibrary.getNonFSMCrewActivitiesFilter();
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], filter + '&' + expand).then(results => {
            results.slice().forEach((entry) => {
                S4CalendarEventsArray(context, eventArray, entry, today, COMPLETED);
            });
            return eventArray;
        }).catch(error =>{
            Logger.error(error);
            return [];
        });
    }
}

function S4CalendarEventsArray(context, eventArray, entry, today, COMPLETED) {
    let startProperty = entry.RequestedStart;
    //For ServiceItemLevel we might use PlannedStartDate as the start property
    if (!IsServiceOrderLevel(context)) {
        startProperty = (IsFSMIntegrationEnabled(context)) ? entry.PlannedStartDate : entry.RequestedStart;
    }
    //Establish date, icon, and start property used in array
    let targetDate, targetIndicator;
    //If there is no Start Date don't add anything
    if (!startProperty) {
        return;
    }
    targetDate = startProperty;
    //Convert due date to date format if it exists
    let dueDate;
    if (entry.DueBy) {
        dueDate = new Date(entry.DueBy);
    }
    //set the dates/indicators to be added
    if (today > dueDate && entry.MobileStatus_Nav.MobileStatus !== COMPLETED) {
        targetIndicator = 'OverdueIndicator';
    } else {
        targetIndicator = 'OpenIndicator';
    }
    //Check to see if event already exists
    const existingEventIndex = eventArray.findIndex(event => event.Date === targetDate);
    if (existingEventIndex === -1) {
        //no entry exists, add entry
        eventArray.push({'Date': targetDate, 'IndicatorName': targetIndicator});
    } else {
        //entry exists so check if its already overdue indicator
        if (eventArray[existingEventIndex].IndicatorName === 'OpenIndicator' && targetIndicator === 'OverdueIndicator') {
            eventArray[existingEventIndex].IndicatorName = 'OverdueIndicator';
        } else {
            return;
        }
    }
    return;
}

function CSCalendarEvents(context) {
    const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const today = new Date();
    let eventArray = [];
    let expand;
    let entitySet;
    let orderBy;
    return MyWorkSectionFSMFilterQuery(context, false).then((filter) => {
        if (IsOperationLevelAssigmentType(context)) {
            expand = '$expand=OperationMobileStatus_Nav,WOHeader';
            entitySet = 'MyWorkOrderOperations';
            orderBy = '$orderby=OrderId';
        } else if (IsSubOperationLevelAssigmentType(context)) {
            expand = '$expand=SubOpMobileStatus_Nav,WorkOrderOperation,WorkOrderOperation/WOHeader';
            entitySet = 'MyWorkOrderSubOperations';
            orderBy = '$orderby=OrderId';
        } else {
            expand = '$expand=OrderMobileStatus_Nav';
            entitySet = 'MyWorkOrderHeaders';
            orderBy = '$orderby=OrderId';
        }
        filter = filter + '&' + expand + '&' + orderBy;
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], filter).then(results => {
            results.slice().forEach((entry) => {
                //Establish date, icon, start, and due property used in array
                let targetDate, targetIndicator;
                let startProperty, dueDateProperty, mobileStatus;
                if (entry['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                    startProperty = entry.ScheduledStartDate;
                    dueDateProperty = entry.DueDate;
                    mobileStatus = entry.OrderMobileStatus_Nav.MobileStatus;
                }
                if (entry['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                    startProperty = entry.SchedEarliestStartDate;
                    dueDateProperty = entry.WOHeader.DueDate;
                    mobileStatus = entry.OperationMobileStatus_Nav.MobileStatus;
                }
                if (entry['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation') {
                    startProperty = entry.WorkOrderOperation.SchedEarliestStartDate;
                    dueDateProperty = entry.WorkOrderOperation.WOHeader.DueDate;
                    mobileStatus = entry.SubOpMobileStatus_Nav.MobileStatus;
                }
                //If there is no Start Date don't add anything
                if (!startProperty) {
                    return;
                }
                targetDate = startProperty;
                //Convert due date to date format if it exists
                let dueDate;
                if (dueDateProperty) {
                    dueDate = new Date(dueDateProperty);
                }
                //set the dates/indicators to be added
                if (today > dueDate && mobileStatus !== COMPLETED) {
                    targetIndicator = 'OverdueIndicator';
                } else {
                    targetIndicator = 'OpenIndicator';
                }
                //Check to see if event already exists
                const existingEventIndex = eventArray.findIndex(event => event.Date === targetDate);
                if (existingEventIndex === -1) {
                    //no entry exists, add entry
                    eventArray.push({'Date': targetDate, 'IndicatorName': targetIndicator});
                } else {
                    //entry exists so check if its already overdue indicator
                    if (eventArray[existingEventIndex].IndicatorName === 'OpenIndicator' && targetIndicator === 'OverdueIndicator') {
                        eventArray[existingEventIndex].IndicatorName = 'OverdueIndicator';
                    } else {
                        return;
                    }
                }
            });
            return eventArray;
        }).catch(error =>{
            Logger.error(error);
            return [];
        });
    });
}
