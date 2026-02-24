import CommonLibrary from '../../../Common/Library/CommonLibrary';
/**
 * Is Quantity value editable
 * @param {IClientAPI} context 
 * @returns true/false
 */
export default function QuantityIsEditable(context) {
    let exceptionHandlingPicker;
    let exceptionHandlingPickerValue;

    if (context.binding['@odata.type'] === '#sap_mobile.WarehouseTaskConfirmation') {
        const controls = context._control._parent._controls;
        exceptionHandlingPicker = controls.find(control => control.getName() === 'ExceptionPicker');
        exceptionHandlingPickerValue = exceptionHandlingPicker?.getValue() ? exceptionHandlingPicker.getValue() : exceptionHandlingPicker.binding.MultiExceptionCodes;
    } else {
        exceptionHandlingPicker = CommonLibrary.getControlProxy(context.getPageProxy(), 'ExceptionPicker');
        exceptionHandlingPickerValue = exceptionHandlingPicker?.getValue();
    }

    if (exceptionHandlingPicker) {
        const internalProcessCode = exceptionHandlingPickerValue[0]?.BindingObject?.InternalProcessCode;
        const returnValue = exceptionHandlingPickerValue[0]?.ReturnValue || exceptionHandlingPickerValue;

        if (internalProcessCode && ['SPLT', 'SPPB', 'DIFF'].includes(internalProcessCode) || returnValue === 'SPLT') {
            return true;
        }
    }

    return false;
}
