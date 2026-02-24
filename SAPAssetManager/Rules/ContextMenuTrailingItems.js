import common from './Common/Library/CommonLibrary';
import isSupervisorFeatureEnabled from './Supervisor/isSupervisorFeatureEnabled';
import EnableWorkOrderEdit from './UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import EnableNotificationEdit from './UserAuthorizations/Notifications/EnableNotificationEdit';
import userFeaturesLib from './UserFeatures/UserFeaturesLibrary';
import ContextMenuTrailingItemsForSignature from './UserAuthorizations/WorkOrders/EnableSignatureDiscard';
import ODataLibrary from './OData/ODataLibrary';

export default async function ContextMenuTrailingItems(context) {
    let trailing = [];

    let entityType = context.binding['@odata.type'];
    let isLocal = ODataLibrary.isLocal(context.binding);
    let data = common.getBindingEntityData(context);
    switch (entityType) {
        case '#sap_mobile.MyWorkOrderHeader': {
            if (isSupervisorFeatureEnabled(context)) {
                return trailing;
            }

            const editEnabled = await EnableWorkOrderEdit(context);
            if (editEnabled) {
                trailing.push('Edit_WorkOrder');
                if (isLocal) {
                    trailing.push('Delete_WorkOrder');
                }
            }
            break;
        }
        case '#sap_mobile.MyWorkOrderOperation': {
            if (isSupervisorFeatureEnabled(context)) {
                return trailing;
            }

            const editEnabled = await EnableWorkOrderEdit(context);
            if (editEnabled) {
                trailing.push('Edit_Operation');
                if (isLocal) {
                    trailing.push('Delete_Operation');
                }
            }
            break;
        }
        case '#sap_mobile.MyWorkOrderSubOperation': {
            const editEnabled = await EnableWorkOrderEdit(context);
            if (editEnabled) {
                trailing.push('Edit_SubOperation');
                if (isLocal) {
                    trailing.push('Delete_SubOperation');
                }
            }
            break;
        }
        case '#sap_mobile.MyNotificationHeader':
            if (EnableNotificationEdit(context)) {
                trailing.push('Edit_Notification');
                if (isLocal) {
                    trailing.push('Delete_Notification');
                }
            }
            return trailing;
        case '#sap_mobile.MyFunctionalLocation':
        case '#sap_mobile.MyEquipment':
            if (context.binding.MeasuringPoints.length > 0 && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMMeasurement.global').getValue())) 
                trailing = ['Take_Reading'];
            else
                trailing = [];
            break;
        case '#sap_mobile.CatsTimesheetOverviewRow':
                trailing = ['Delete_Timesheet'];
            break;
        case '#sap_mobile.Confirmation':
            if (isLocal) {
                trailing = ['Delete_Confirmation'];
            } else {
                trailing = [];
            }
            break;
        case '#sap_mobile.MyFuncLocDocument':
        case '#sap_mobile.MyNotifDocument':
        case '#sap_mobile.MyEquipDocument':
        case '#sap_mobile.Document':
        case '#sap_mobile.S4ServiceOrderDocument':
        case '#sap_mobile.S4ServiceRequestDocument':
            if (isLocal) {
                trailing = ['Delete_Document'];
            } else {
                trailing = [];
            }
            break;
        case '#sap_mobile.MyWorkOrderDocument':  
            if (isLocal) {
                trailing = ['Delete_Document'];
            } else {
                trailing = [];
            }
            
            //disable signatures removal after work order is completed
            if (data && data.Document && data.OrderId) {
                return ContextMenuTrailingItemsForSignature(context, data, trailing);
            }
            break;
        case '#sap_mobile.MeasurementDocument':
            if (isLocal) {
                trailing = ['Delete_MeasurementDocument'];
            } else {
                trailing = [];
            }
            break;
        case '#sap_mobile.UserPreference':
            trailing = ['Delete_Entry'];
            break;
        case '#OfflineOData.ErrorArchiveEntity':
            trailing = ['Delete_Entry'];
            break;
        case '#sap_mobile.FSMFormInstance':
            if (isLocal) {
                trailing = ['Delete_Entry'];
            }
            break;
        case '#sap_mobile.DynamicFormLinkage':
            if (isLocal) {
                trailing = ['Delete_Entry'];
            }
            break;
        default:
            break;
    }
    return trailing;
}
