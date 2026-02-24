import common from '../Common/Library/CommonLibrary';
import personaLib from '../Persona/PersonaLibrary';
import isServiceItem from '../ServiceOrders/ServiceItems/IsServiceItemCategory';
import isGuidedFlowEnabled from '../GuidedWorkFlow/IsGuidedFlowEnabled';
import GuidedFlowGenerator from '../GuidedWorkFlow/GuidedFlowGenerator';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';
import TechniciansExist from '../WorkOrders/Operations/TechniciansExist';
import OperationMobileStatusLibrary from '../Operations/MobileStatus/OperationMobileStatusLibrary';

export default async function IsTimelineControlVisible(context) {
    let isVisible = false;
    let isCGWFEnabled = await isGuidedFlowEnabled(context);
    if (isCGWFEnabled) {
        let objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrder.global').getValue();
        let mobileStatus = context.binding?.OrderMobileStatus_Nav?.MobileStatus;
        if (context.binding && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
            objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();
            mobileStatus = context.binding?.OperationMobileStatus_Nav?.MobileStatus;

             //if splits exist but there isn't one for the current user then we hide the tracker if user is not authorized to change operation status
            if (await TechniciansExist(context, context.binding) && MobileStatusLibrary.isOperationStatusChangeable(context)) {

                const result = await OperationMobileStatusLibrary.handleSplitStatusAndAuthorization(context, context.binding);
                if (result.empty) {
                    return false;
                }
                objectType = result.objectType;
                mobileStatus = result.mobileStatus;
            }

        } else if (context.binding && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation') {
            objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();
            mobileStatus = context.binding?.SubOpMobileStatus_Nav?.MobileStatus;
        } else if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
            objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/OrderMobileStatusObjectType.global').getValue();
            mobileStatus = context.binding?.MobileStatus_Nav?.MobileStatus;
        } else if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
            objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ItemMobileStatusObjectType.global').getValue();
            mobileStatus = context.binding?.MobileStatus_Nav?.MobileStatus;
        } else if (context.binding && context.binding['@odata.type'] === '#sap_mobile.MyNotificationHeader') {
            objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/Notification.global').getValue();
            mobileStatus = context.binding?.NotifMobileStatus_Nav?.MobileStatus;
        } else if (context.binding && context.binding['@odata.type'] === '#sap_mobile.MyNotificationTask') {
            objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/Task.global').getValue();
            mobileStatus = context.binding?.TaskMobileStatus_Nav?.MobileStatus;
        } else if (context.binding && context.binding['@odata.type'] === '#sap_mobile.MyNotificationItemTask') {
            objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/Task.global').getValue();
            mobileStatus = context.binding?.ItemTaskMobileStatus_Nav?.MobileStatus;
        }
        let guidedFlowGenerator = await new GuidedFlowGenerator(context, context.binding, objectType, mobileStatus);
        let flowId = guidedFlowGenerator.getCurrentFlowId();
        if (ValidationLibrary.evalIsEmpty(flowId)) {
            isCGWFEnabled = false;
        }
    }
    const pageProxy = context.getPageProxy();
    ///Enable control Visibility based on FSM persona and assigment type
    let entityset = common.getEntitySetName(pageProxy);
    switch (entityset) {
        case 'MyWorkOrderHeaders':
            isVisible = ((isCGWFEnabled || personaLib.isFieldServiceTechnician(pageProxy)) && common.getWorkOrderAssnTypeLevel(pageProxy) === 'Header');
            break;
        case 'MyWorkOrderOperations':
            isVisible = ((isCGWFEnabled || personaLib.isFieldServiceTechnician(pageProxy)) && common.getWorkOrderAssnTypeLevel(pageProxy) === 'Operation');
            break;
        case 'MyWorkOrderSubOperations':
            isVisible = ((isCGWFEnabled || personaLib.isFieldServiceTechnician(pageProxy)) && common.getWorkOrderAssnTypeLevel(pageProxy) === 'SubOperation');
            break;
        case 'S4ServiceOrders':
        case 'S4ServiceRequests':
            isVisible = (common.getS4AssnTypeLevel(pageProxy) === 'Header' && personaLib.isFieldServiceTechnician(pageProxy));
            break;
        case 'S4ServiceItems':
            isVisible = (common.getS4AssnTypeLevel(pageProxy) === 'Item' && personaLib.isFieldServiceTechnician(pageProxy) && isServiceItem(pageProxy));
            break;
        case 'MyNotificationHeaders':
        case 'MyNotificationTasks':
        case 'MyNotificationItemTasks':
            isVisible = isCGWFEnabled;
            break;
        default:
            break;
    }
    return isVisible;
}
