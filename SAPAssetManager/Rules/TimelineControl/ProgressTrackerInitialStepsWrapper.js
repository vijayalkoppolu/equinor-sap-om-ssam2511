import IsGuidedFlowEnabled from '../GuidedWorkFlow/IsGuidedFlowEnabled';
import ProgressTrackerInitialSteps from './ProgressTrackerInitialSteps';
import ProgressTrackerGuidedWorkFlowInitialSteps from './ProgressTrackerGuidedWorkFlowInitialSteps';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import GuidedFlowGenerator from '../GuidedWorkFlow/GuidedFlowGenerator';
import TechniciansExist from '../WorkOrders/Operations/TechniciansExist';
import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';
import OperationMobileStatusLibrary from '../Operations/MobileStatus/OperationMobileStatusLibrary';

export default async function ProgressTrackerInitialStepsWrapper(context) {
    let objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrder.global').getValue();
    let mobileStatus = '';
    let binding = context.binding;

    if (await IsGuidedFlowEnabled(context)) {
        if (binding) {
            let entityType = binding['@odata.type'];
            switch (entityType) {
                case '#sap_mobile.MyWorkOrderHeader':
                    mobileStatus = binding?.OrderMobileStatus_Nav?.MobileStatus;
                    break;
                case '#sap_mobile.MyWorkOrderOperation':
                    objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();
                    mobileStatus = binding?.OperationMobileStatus_Nav?.MobileStatus;

                    //if splits exist and there is a split for the current user then we're changing the split status
                    if (await TechniciansExist(context, binding) && MobileStatusLibrary.isOperationStatusChangeable(context)) {

                        const result = await OperationMobileStatusLibrary.handleSplitStatusAndAuthorization(context, binding);
                        if (result.empty) {
                            return Promise.resolve();
                        }
                        binding = result.binding;
                        objectType = result.objectType;
                        mobileStatus = result.mobileStatus;
                    }
                    break;
                case '#sap_mobile.MyWorkOrderSubOperation':
                    objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();
                    mobileStatus = binding?.SubOpMobileStatus_Nav?.MobileStatus;
                    break;
                case '#sap_mobile.S4ServiceOrder':
                    objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/OrderMobileStatusObjectType.global').getValue();
                    mobileStatus = binding?.MobileStatus_Nav?.MobileStatus;
                    break;
                case '#sap_mobile.S4ServiceItem':
                    objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ItemMobileStatusObjectType.global').getValue();
                    mobileStatus = binding?.MobileStatus_Nav?.MobileStatus;
                    break;
                case '#sap_mobile.MyNotificationHeader':
                    objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/Notification.global').getValue();
                    mobileStatus = binding?.NotifMobileStatus_Nav?.MobileStatus;
                    break;
                case '#sap_mobile.MyNotificationTask':
                    objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/Task.global').getValue();
                    mobileStatus = binding?.TaskMobileStatus_Nav?.MobileStatus;
                    break;
                case '#sap_mobile.MyNotificationItemTask':
                    objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/Task.global').getValue();
                    mobileStatus = binding?.ItemTaskMobileStatus_Nav?.MobileStatus;
                    break;
                default:
                    break;
            }
        }
        let guidedFlowGenerator = await new GuidedFlowGenerator(context, binding, objectType, mobileStatus);
        let flowId = guidedFlowGenerator.getCurrentFlowId();
        if (ValidationLibrary.evalIsNotEmpty(flowId)) {
            return ProgressTrackerGuidedWorkFlowInitialSteps(context, binding);
        }
    }
    return ProgressTrackerInitialSteps(context);
}
