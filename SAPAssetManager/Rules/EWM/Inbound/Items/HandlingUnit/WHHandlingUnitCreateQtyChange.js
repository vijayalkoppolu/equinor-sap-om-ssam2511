import libCommon from '../../../../Common/Library/CommonLibrary';

export default function WHHandlingUnitCreateQtyChange(context) {
    const value = context.getValue();

    if (!value) {
        return Promise.reject();
    }

    const pageProxy = context.getPageProxy();
    const formCellContainer = pageProxy.getControl('FormCellContainer');
    const valueAsNumber = +value;

    return validateQty(context, formCellContainer).then(() => {
        if (context.getName() === 'NumberOfHUs') {
            const huNumberControl = formCellContainer.getControl('HUNumber');
            huNumberControl.setEnabled(valueAsNumber === 1);

            const specifyQtyToPackButton = formCellContainer.getControl('SpecifyQtyToPackButton');
            specifyQtyToPackButton.setEnabled(valueAsNumber > 1);
        }

        pageProxy.getClientData().items = undefined;

        return Promise.resolve();
    });
}

export function validateQty(control, formCellContainer) {
    libCommon.clearValidationOnInput(control);

    const controlName = control.getName();
    const valueAsNumber = +control.getValue();

    if (valueAsNumber <= 0 || !Number.isInteger(valueAsNumber)) {
        return showInlineError(control, control.localizeText('validation_value_integer_greater_than_zero'));
    }

    if (controlName === 'NumberOfHUs') {
        const qtyToPackControl = formCellContainer.getControl('QtyToPack');

        if (valueAsNumber > qtyToPackControl.getValue()) {
            return showInlineError(control, control.localizeText('validation_value_less_or_equal_than_quantity_to_pack'));
        }
    } else {
        const numberOfHUsControl = formCellContainer.getControl('NumberOfHUs');

        if (valueAsNumber > control.getPageProxy().binding.OpenPackableQuantity) {
            return showInlineError(control, control.localizeText('validation_value_less_or_equal_to_open_packable_quantity'));
        }

        if (valueAsNumber < numberOfHUsControl.getValue()) {
            return showInlineError(control, control.localizeText('validation_value_less_or_equal_to_number_of_handling_units'));
        }
    }

    return Promise.resolve();
}

function showInlineError(context, message) {
    libCommon.setInlineControlError(context, context, message);
    context.applyValidation();
    return Promise.reject();
}
