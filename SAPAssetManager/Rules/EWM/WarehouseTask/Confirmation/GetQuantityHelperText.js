import { GetConfirmedAndTotalQuantity } from '../../Common/EWMLibrary';
import Logger from '../../../Log/Logger';

export default function GetQuantityHelperText(context) {
    let exceptionHandlingPicker;
    let exceptionHandlingPickerValue;

    let pageProxy = context.getPageProxy();
    let formCellSections = pageProxy.getControls();

    if (formCellSections.length > 0) {
        let controls = formCellSections[0]._control._controls;
        exceptionHandlingPicker = controls.find(control => control.getName() === 'ExceptionPicker');
        exceptionHandlingPickerValue = exceptionHandlingPicker?.getValue();
    }

    if (context.binding['@odata.type'] === '#sap_mobile.WarehouseTaskConfirmation') {
        let controls = context._control._parent._controls;
        exceptionHandlingPicker = controls.find(control => control.getName() === 'ExceptionPicker');
        exceptionHandlingPickerValue = exceptionHandlingPicker?.getValue() ? exceptionHandlingPicker.getValue() : exceptionHandlingPicker.binding.MultiExceptionCodes;
    }

    return GetConfirmedAndTotalQuantity(context).then(({ confirmedQuantity, totalQuantity }) => {
        if (exceptionHandlingPicker) {
            const internalProcessCode = exceptionHandlingPickerValue[0]?.BindingObject?.InternalProcessCode;
            const returnValue = exceptionHandlingPickerValue[0]?.ReturnValue || exceptionHandlingPickerValue;
            if (internalProcessCode === 'SPLT' || returnValue === 'SPLT') {
                return context.localizeText('original_quantity', [totalQuantity]);
            }

            if (internalProcessCode && ['SPPB', 'DIFF'].includes(internalProcessCode)) {
                let remainingQuantityValue = `${confirmedQuantity}/${totalQuantity}`;
                return context.localizeText('confirmed_quantity', [remainingQuantityValue]);
            }
        }

        return context.localizeText('quantity_param', [totalQuantity]);
    }).catch(error => {
        Logger.error('Error in GetQuantityHelperText:', error);
        return context.localizeText('quantity_param') + `: ${context.binding.Quantity}`;
    });
}
