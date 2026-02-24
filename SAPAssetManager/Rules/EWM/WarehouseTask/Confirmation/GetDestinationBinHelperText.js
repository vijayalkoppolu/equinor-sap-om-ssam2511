export default function GetDestinationBinHelperText(context) {

    const destinationBin = context.binding.WarehouseTask_Nav ? context.binding.WarehouseTask_Nav.DestinationBin : context.binding.DestinationBin;

    let pageProxy = context.getPageProxy();
    let formCellSections = pageProxy.getControls();
    let exceptionHandlingPickerValue = '';
    let exceptionHandlingPicker;

    if (formCellSections.length > 0) {
        let controls = formCellSections[0]._control._controls;
        exceptionHandlingPicker = controls.find(control => control.getName() === 'ExceptionPicker');
        exceptionHandlingPickerValue = exceptionHandlingPicker.getValue();
    }

    if (context.binding['@odata.type'] === '#sap_mobile.WarehouseTaskConfirmation') {
        let controls = context._control._parent._controls;
        exceptionHandlingPicker = controls.find(control => control.getName() === 'ExceptionPicker');
        exceptionHandlingPickerValue = exceptionHandlingPicker?.getValue() ? exceptionHandlingPicker.getValue() : exceptionHandlingPicker.binding.MultiExceptionCodes;
    }

    if (exceptionHandlingPicker) {
        const internalProcessCode = exceptionHandlingPickerValue[0]?.BindingObject?.InternalProcessCode;
        const returnValue = exceptionHandlingPickerValue[0]?.ReturnValue || exceptionHandlingPickerValue;
        
        if (internalProcessCode && ['SPLT', 'SPPB', 'DIFF'].includes(internalProcessCode) || returnValue === 'SPLT') {
            return context.localizeText('original_destination_bin', [destinationBin]);
        }
    }
}
