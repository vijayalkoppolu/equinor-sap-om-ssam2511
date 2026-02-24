import libCom from '../../Common/Library/CommonLibrary';
import operationQueryOptions from './OperationPickerQueryOptions';
import libSuper from '../../Supervisor/SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import OnOperationChangeListPickerUpdate, {redrawListControl} from './OnOperationChangeListPickerUpdate';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import AnyScenarioIsEnabledForWorkOrder from '../../ConfirmationScenarios/AnyScenarioIsEnabledForWorkOrder';
import libConfirm from '../../ConfirmationScenarios/ConfirmationScenariosLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';

export default async function OnWorkOrderChanged(context) {
    let binding = context.getBindingObject();
    let orderId = context.getValue()[0] ? context.getValue()[0].ReturnValue : '';
    let pageProxy = context.getPageProxy();
    let finalControl = libCom.getControlProxy(pageProxy, 'IsFinalConfirmation');
    let accountIndicatorListPicker = libCom.getControlProxy(pageProxy, 'AcctIndicatorPkr');
    let woLstPicker = libCom.getControlProxy(pageProxy, 'WorkOrderLstPkr');
    /* Clear the validation if the field is not empty */
    ResetValidationOnInput(woLstPicker);

    if (orderId.length === 0) {
        if (binding.IsFinalChangable) { //Allow changing is final since no work order selected
            finalControl.setEditable(true);
        }
        //Unselected, clear dependent controls
        return onNoWorkOrder(pageProxy);
    }
    let result = await context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$expand=OrderMobileStatus_Nav&$filter=OrderId eq '${orderId}'&$top=1`);
    if (!result || result.length === 0) {
        binding.ConfirmationScenarioPlant = '';
        binding.ConfirmationScenarioOrderType = '';
        return onNoWorkOrder(pageProxy);
    }
    let workOrder = result.getItem(0);
    binding.ConfirmationScenarioPlant = workOrder.PlanningPlant;
    binding.ConfirmationScenarioOrderType = workOrder.OrderType;
    accountIndicatorListPicker.setValue(workOrder.AccountingIndicator);

    let showCoopButtons = await AnyScenarioIsEnabledForWorkOrder(context, workOrder.PlanningPlant, workOrder.OrderType) && !IsCompleteAction(context); //Do not allow scenarios during consolidated complete
    let coopButtons = libCom.getControlProxy(pageProxy, 'ScenarioSeg');
    if (coopButtons && showCoopButtons) { //Show the cooperation buttons if this workorder supports scenario confirmations
        const captionDescriptor = context.getBindingObject().IsOnCreate ? 'create' : 'update';
        const currentScenario = libCom.getListPickerValue(coopButtons.getValue());
        
        coopButtons.setEditable(true);
        await libConfirm.confirmationScenariosSegmentsRedraw(context, workOrder.PlanningPlant, workOrder.OrderType); //Reset the segments based on chosen work order
        if (currentScenario) {
            coopButtons.setValue(currentScenario); //Set the current scenario if it exists
        }
        if (currentScenario === 'Support' || currentScenario === 'DoubleCheck') { //This is a scenario confirmation already, so it cannot be changed
            coopButtons.setEditable(false);
        } else { 
            coopButtons.setValue('None'); //Set to none if not already set, so user can select a scenario
        }
        if (captionDescriptor === 'update') { //Edited confirmations cannot be changed to cooperations
            coopButtons.setEditable(false);
        }
        coopButtons.setVisible(true);
    } else { //This workorder does not support cooperation confirmations or the feature is disabled
        coopButtons.setVisible(false);
        coopButtons.setValue('None');
    }

    return libSuper.checkReviewRequired(context, workOrder).then(review => {
        if (review && !libMobile.isSubOperationStatusChangeable(context)) { //If not sub-operation assignment and needs review, then don't allow final confirmation to be set by user
            finalControl.setValue(false);    
            finalControl.setEditable(false);
        } else if (binding.IsFinalChangable) {
            finalControl.setEditable(true);
        }
        return onWorkOrderReceived(pageProxy, orderId);
    });
}

//Work order selected, so populate and enable the operation picker and other dependent pickers
function onWorkOrderReceived(pageProxy, orderTemp) {    
    return Promise.all([operationQueryOptions(pageProxy, orderTemp)]).then(function(operationResult) {
        let binding = pageProxy.binding || {};
        let enableOperation = binding.IsOnCreate;
        return pageProxy.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderOperations', operationResult[0]).then(count => {
            let clearOperationValue = !orderTemp || orderTemp !== binding.OrderID;

            if (count === 1) clearOperationValue = false; //Do not reset if only one operation for this WO to allow picker to auto-select the entry
            if (binding.ConfirmationScenarioFeature && !binding.ConfirmationScenarioIsFromWorkOrder) enableOperation = false; //Do not allow changing operation if this is a scenario confirmation for an operation or sub-operation
            if (binding.IsOperationChangable === false) enableOperation = false; //Do not allow changing operation if the flag is set to false
            
            return redrawListControl(pageProxy, 'OperationPkr', operationResult[0], enableOperation, clearOperationValue).then(() => {
                return OnOperationChangeListPickerUpdate(pageProxy).then(() => {
                    pageProxy.getControl('FormCellContainer').redraw();
                });
            });
        });
    });
}

//No work order, so empty and disable dependent pickers
function onNoWorkOrder(pageProxy) {    
    redrawListControl(pageProxy, 'OperationPkr', '', false, true);
    redrawListControl(pageProxy, 'SubOperationPkr', '', false, true);
    redrawListControl(pageProxy, 'ActivityTypePkr', '', false, true);
    redrawListControl(pageProxy, 'VarianceReasonPkr', '', false, true);
    pageProxy.getControl('FormCellContainer').redraw();
    return Promise.resolve(true);
}
