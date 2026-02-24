import { WarehouseTaskStatus } from '../../Common/EWMLibrary';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { getWarehouseTaskItem } from './WarehouseTaskConfirmationItem';
/**
 * 
 * @param {*} context 
 * @returns {Promise<string>}
 */
export default function WarehouseTaskConfirmationCaption(context) {
    let pageProxy = context.getPageProxy();
    let exceptionHandlingPicker = CommonLibrary.getControlProxy(pageProxy, 'ExceptionPicker');
    let exceptionHandlingPickerValue = exceptionHandlingPicker?.getValue();

    return getWarehouseTaskItem(context).then(taskNumber => {
        let confirmTaskText = context.localizeText('confirm_task', [taskNumber]);

        if (exceptionHandlingPicker) {
            const internalProcessCode = exceptionHandlingPickerValue[0]?.BindingObject?.InternalProcessCode;
            const returnValue = exceptionHandlingPickerValue[0]?.ReturnValue || exceptionHandlingPickerValue;

            if (internalProcessCode && ['SPLT', 'SPPB', 'DIFF'].includes(internalProcessCode) || returnValue === 'SPLT') {
                return confirmTaskText;
            }
        }

        return context.binding.WTStatus === WarehouseTaskStatus.Confirmed
            ? context.localizeText('ewm_confirm_task_update')
            : context.localizeText('ewm_confirm_task');
    });
}
