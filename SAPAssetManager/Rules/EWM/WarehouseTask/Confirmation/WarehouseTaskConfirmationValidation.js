import libCom from '../../../Common/Library/CommonLibrary';
/**
 * Check the quantity entered by the user in the quantity field.
 * @param {IClientAPI} context 
 */
export default function WarehouseTaskConfirmationValidation(context) {
    const item =  libCom.getStateVariable(context, 'WarehouseTask');
    if (item) {
        return true;
    }
    const quantity = parseFloat(context.binding.Quantity);
    const whQuantitySimple = libCom.getControlProxy(context, 'WhQuantitySimple');
    const currentValue = parseFloat(whQuantitySimple.getValue());
    let errorText = '';
    if (currentValue < 1) {
        errorText = context.localizeText('invalid_quantity_error_message');
    } else if (currentValue > quantity) {
        errorText = context.localizeText('exceeding_quantity_error_message',[quantity]);
    }
    if (errorText) {
        libCom.executeInlineControlError(context, whQuantitySimple, errorText);
        return false;
    }
    return true;
}

