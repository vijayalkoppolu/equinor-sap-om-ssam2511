import IsWONotificationVisible from '../Complete/Notification/IsWONotificationVisible';
import WorkOrderCompletionLibrary, { runComplete } from '../Complete/WorkOrderCompletionLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import libConfirm from '../../ConfirmationScenarios/ConfirmationScenariosLibrary';

export default async function NavOnCompleteSubOperationPage(context, actionBinding) {
    context.dismissActivityIndicator(); // RunMobileStatusUpdateSequence triggers showActivityIndicator which may result in infinite loading when CheckRequiredFields action is executed.

    let binding = actionBinding || context.getPageProxy().getActionBinding() || libCommon.getBindingObject(context);

    //Check for mandatory double-check confirmation
    const checkFailed = await libConfirm.isDoubleCheckRequiredForThisOperation(context, binding.OrderId, binding.OperationNo, binding.SubOperationNo);
    if (checkFailed) { //Display validation error dialog and exit
        return await libCommon.showErrorDialog(context, context.localizeText('double_check_required_operation'));
    }

    WorkOrderCompletionLibrary.getInstance().setCompletionFlow('suboperation');
    await WorkOrderCompletionLibrary.getInstance().initSteps(context);
    WorkOrderCompletionLibrary.getInstance().setBinding(context, binding);

    let expandOperationAction = Promise.resolve();
    if (binding && binding['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation' && (!binding.WorkOrderOperation || !binding.WorkOrderOperation.WOHeader)) {
        expandOperationAction = context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.editLink'], [], '$expand=WorkOrderOperation/WOHeader');
    }

    return expandOperationAction.then(function(result) {
        if (result && result.length > 0 && result.getItem(0).WorkOrderOperation) {
            if (binding.WorkOrderOperation) {
                binding.WorkOrderOperation.WOHeader = result.getItem(0).WorkOrderOperation.WOHeader;
            } else {
                binding.WorkOrderOperation = result.getItem(0).WorkOrderOperation;
            }
        }

        return IsWONotificationVisible(context, binding, 'Notification').then((notification) => {
            if (notification) {
                WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                    visible: true,
                    data: JSON.stringify(notification),
                    link: notification['@odata.editLink'],
                    initialData: JSON.stringify(notification),
                });
            } else {
                WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                    visible: false,
                });
            }

            return runComplete(context, context.localizeText('complete_suboperation_warning_message'));
        });
    });
}
