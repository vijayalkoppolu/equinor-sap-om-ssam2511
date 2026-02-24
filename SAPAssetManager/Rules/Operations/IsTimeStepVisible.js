import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';
import { isOperationSupportConfirmation } from '../WorkOrders/Operations/WorkOrderOperationLibrary';
import { GlobalVar as globals } from '../Common/Library/GlobalCommon';
import ODataLibrary from '../OData/ODataLibrary';

/**
* Returns true if the confirmation indicator is not 3 (operation level only)
* @param {IClientAPI} context
*/
export default async function IsTimeStepVisible(context) {
    const isTimeStepVisible = WorkOrderCompletionLibrary.isStepVisible(context, 'time');
    const binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    const isLocal = ODataLibrary.isLocal(binding);
    
    if (binding?.ControlKey) {
        const isConfirmationSupported = await isOperationSupportConfirmation(context, binding);
        const isAutoReleaseOn = isLocal === false ? true: globals.getAppParam().WORKORDER.AutoRelease === 'Y';
        const isEnabledOnLocal = isLocal === false ? true: globals.getAppParam().MOBILESTATUS.EnableOnLocalBusinessObjects === 'Y';
        return isConfirmationSupported && isTimeStepVisible && isAutoReleaseOn && isEnabledOnLocal;
    }

    return Promise.resolve(isTimeStepVisible);
}
