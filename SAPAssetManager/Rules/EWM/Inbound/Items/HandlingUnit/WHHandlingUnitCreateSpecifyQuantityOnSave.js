import libVal from '../../../../Common/Library/ValidationLibrary';

export default function WHHandlingUnitCreateSpecifyQuantityOnSave(context) {
    const edtControl = context.getControls()[0].getSections()[0].getExtension();
    const values = edtControl.getAllValues();
    let hasNumberError = false;
    let hasZeroQuantityError = false;

    for (let i = 0; i < values.length; i++) {
        const qty = values[i]?.Properties?.qty;
        if (qty !== undefined && qty !== null && qty <= 0) {
            hasZeroQuantityError = true;
            break;
        }
    }

    if (hasZeroQuantityError) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/ErrorBannerMessage.action',
            'Properties': {
                'Message': context.localizeText('validation_quantity_must_be_greater_than_zero'),
            },
        });
    }

    const sum = values.reduce((acc, row) => {
        if (row.Properties.qty && row.Properties.qty > 0) {
            return acc + +row.Properties.qty;
        }
        return acc;
    }, 0);

    if (sum !== context.binding.packableItemsCount) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/ErrorBannerMessage.action',
            'Properties': {
                'Message': context.localizeText('validation_packing_quantity_equal_to_quantity_to_pack'),
            },
        });
    }
    for (let i = 0; i < values.length; i++) {
        const raw = values[i]?.Properties?.number;
        const str = (raw ?? '').toString().trim();
        const cell = edtControl.getRowCellByName(i, 'number');

        cell?.clearValidation?.();

        if (!libVal.evalIsEmpty(str) && !libVal.evalIsNumeric(str)) {
            cell?.setValidationMessage?.(context.localizeText('validate_numeric_hu_number'));
            cell?.applyValidation?.();
            hasNumberError = true;
        }
    }

    if (hasNumberError) {
        return context.executeAction({
            Name: '/SAPAssetManager/Actions/ErrorBannerMessage.action',
            Properties: { Message: context.localizeText('forms_error_banner') },
        });
    }
    context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().items = values.map(row => ({
        qty: row.Properties.qty,
        uom: row.Properties.uom,
        number: row.Properties.number,
    }));

    return context.executeAction('/SAPAssetManager/Actions/Common/CloseChildModal.action');
}
