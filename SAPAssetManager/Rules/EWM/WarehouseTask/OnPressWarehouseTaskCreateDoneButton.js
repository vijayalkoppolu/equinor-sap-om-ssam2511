import CommonLibrary from '../../Common/Library/CommonLibrary';
import WHInboundDeliveryCountUnusedQuantity from '../Inbound/Items/WHInboundDeliveryCountUnusedQuantity';

export default async function OnPressWarehouseTaskCreateDoneButton(context) {

    const quantityFieldControl = CommonLibrary.getControlProxy(context?.getPageProxy(), 'WhQuantitySimple');
    const validationResult = await WHTMandatoryFieldValidation(context);

    if (validationResult !== 'valid') {
        const errorMessage = context.localizeText(validationResult);

        CommonLibrary.executeInlineControlError(context, quantityFieldControl, errorMessage);
        return Promise.reject();
    }

    return context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/WarehouseTaskCSCreate.action')
        .then(() => context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/WarehouseTaskCreateSuccessWithClose.action'));
}


export async function WHTMandatoryFieldValidation(context) {
    const enteredQuantity = parseFloat(context.evaluateTargetPath('#Control:WhQuantitySimple/#Value'));
    const maxQuantity = await WHInboundDeliveryCountUnusedQuantity(context);

    if (enteredQuantity === 0) {
        return 'quantity_must_be_greater_than_zero';
    } else if (enteredQuantity > maxQuantity) {
        return 'quantity_validation';
    } else if (!enteredQuantity || enteredQuantity < 0) {
        return 'invalid_quantity_error_message';
    }

    return 'valid';
}
