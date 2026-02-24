import libCom from './Common/Library/CommonLibrary';
import EnableWorkOrderCreate from './UserAuthorizations/WorkOrders/EnableWorkOrderCreate';
import MobileStatusGeneratorWrapper from './MobileStatus/MobileStatusGeneratorWrapper';
import StatusUIGenerator from './MobileStatus/StatusUIGenerator';
import CurrentMobileStatusOverride from './MobileStatus/CurrentMobileStatusOverride';
import { reloadUserTimeEntriesForLocalStatus } from './OverviewPage/MyWorkSection/ObjectCardButtonVisible';
import EnableNotificationEdit from './UserAuthorizations/Notifications/EnableNotificationEdit';
import OperationMobileStatusLibrary from './Operations/MobileStatus/OperationMobileStatusLibrary';
import TechniciansExist from './WorkOrders/Operations/TechniciansExist';
import MobileStatusLibrary from './MobileStatus/MobileStatusLibrary';

export default async function ContextMenuLeadingItems(context) {

    // Declare mobile statuses as rule-scoped constants
    const COMPLETED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());

    // Helper function: determine items to show for Notification context menu
    const notificationMenuItems = async function() {
        const statusItems = await notificationMobileStatusMenuItems();

        if (EnableNotificationEdit(context)) {
            statusItems.push('Add_Item');
        }

        return statusItems;
    };

    // Helper function: determine items to show for Work Order context menu
    let orderMenuItems = async function() {
        const statusItems = await orderMobileStatusMenuItems();

        if (!libCom.isDefined(statusItems)) {
            const mobileStatus = context.binding?.OrderMobileStatus_Nav?.MobileStatus;

            if (mobileStatus !== COMPLETED) {
                return ['Add_Notification'];
            }
            return [];
        }
        return statusItems;
    };

    const orderMobileStatusMenuItems = async function() {
        const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrder.global').getValue();
        const items = await getStatusMenuItemsForObjectType(context, objectType);

        return items;
    };

    // Helper function: determine items to show for Operation context menu
    let operationMobileStatusMenuItems = async function() {
        let binding = context.binding;
        let objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();
        let items = [];

        //if splits exist and there is a split for the current user then we're changing the split status
        if (await TechniciansExist(context, binding) && MobileStatusLibrary.isOperationStatusChangeable(context)) {
            const result = await OperationMobileStatusLibrary.handleSplitStatusAndAuthorization(context, binding);
            if (result.empty) {
                return items;
            }
            binding = result.binding;
            objectType = result.objectType;
        }

        items = await getStatusMenuItemsForObjectType(context, objectType, binding);

        return items;
    };

    const notificationMobileStatusMenuItems = async function() {
        const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/Notification.global').getValue();
        const items = await getStatusMenuItemsForObjectType(context, objectType);

        return items;
    };

    let operationMenuItems = async function(navLinkName) {
        const statusItems = await operationMobileStatusMenuItems();

        if (!libCom.isDefined(statusItems)) {
            const mobileStatus = context.binding?.[navLinkName]?.MobileStatus;

            if (mobileStatus !== COMPLETED) {
                return ['Add_Notification'];
            }
            return [];
        }
        return statusItems;
    };

    // Rule logic begins here //
    let leading = [];
    let entityType = context.binding['@odata.type'];
    let enableWorkOrderCreate = EnableWorkOrderCreate(context);

    switch (entityType) {
        case '#sap_mobile.MyWorkOrderHeader':
            leading = orderMenuItems();
            break;
        case '#sap_mobile.MyWorkOrderOperation':
            leading = operationMenuItems('OperationMobileStatus_Nav');
            break;
        case '#sap_mobile.MyWorkOrderSubOperation':
            leading = operationMenuItems('SubOpMobileStatus_Nav');
            break;
        case '#sap_mobile.MyNotificationHeader':
            leading = notificationMenuItems();
            break;
        case '#sap_mobile.MyFunctionalLocation':
            if (enableWorkOrderCreate) {
                leading = Promise.resolve(['Add_NotificationFromFloc', 'Add_WorkOrderFromFloc']);
            } else {
                leading = Promise.resolve(['Add_NotificationFromFloc']);
            }
            break;
        case '#sap_mobile.MyEquipment':
            if (enableWorkOrderCreate) {
                leading = Promise.resolve(['Add_NotificationFromEquipment', 'Add_WorkOrderFromEquipment']);
            } else {
                leading = Promise.resolve(['Add_NotificationFromEquipment']);
            }
            break;
        case '#sap_mobile.CatsTimesheetOverviewRows':
            leading = Promise.resolve(['Delete_Timesheet']);
            break;
        case '#sap_mobile.Confirmations':
            leading = Promise.resolve(['Delete_Confirmation']);
            break;
        case '#sap_mobile.MyFuncLocDocuments':
            break;
        case '#sap_mobile.MyNotifDocuments':
            break;
        case '#sap_mobile.MyEquipDocuments':
            break;
        case '#sap_mobile.MyWorkOrderDocuments':
            break;
        case '#sap_mobile.Documents':
            break;
        case '#sap_mobile.MeasurementDocuments':
            leading = Promise.resolve(['Delete_MeasurementDocument']);
            break;
        default:
            break;
    }
    return leading;
}

async function getStatusMenuItemsForObjectType(context, objectType, binding = context.binding) {



    await reloadUserTimeEntriesForLocalStatus(context, binding);

    const currentStatusOverride = CurrentMobileStatusOverride(context, binding);
    const StatusGeneratorWrapper = new MobileStatusGeneratorWrapper(context, binding, objectType, currentStatusOverride);
    let options = await StatusGeneratorWrapper.generateMobileStatusOptions();
    StatusUIGenerator.orderItemsByTransitionType(options);

    return options.map(option => option._Name);
}
