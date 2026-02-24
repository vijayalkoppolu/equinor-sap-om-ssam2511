import Logger from '../../../Log/Logger';

export default async function WHInboundDeliveryCheckQuantityValidity(context, edtCell) {
    const wareHouseTaskQuantity = parseInt(await getWarehouseTaskQuantities(context, edtCell.context.binding));
    const newQuantity = parseInt(edtCell.getValue());
    const packedQuantity = parseInt(edtCell.context.binding.PackedQuantity);

    if (edtCell.getValue() === undefined) {
        edtCell.applyValidation(context.localizeText('ewm_missing_quantity_error'));
        return false;
    }
    if (newQuantity < 1) {
        edtCell.applyValidation(context.localizeText('ewm_nonpositive_quantity_error'));
        return false;
    }
    if (newQuantity < wareHouseTaskQuantity + packedQuantity) {
        edtCell.applyValidation(context.localizeText('ewm_insufficient_quantity_error'));
        return false;
    }
    return true;
}

function getWarehouseTaskQuantities(context, binding) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/WarehouseTask_Nav`, ['Quantity'], '').then(result => {
        const items = result?.slice() || [];
        const value = items.reduce((sum, item) => sum + Number(item.Quantity), 0);
        return String(value > 0 ? value : 0);
    }).catch(error => {
        Logger.error('Task Quantity count error:', error);
        return '0';
    });
}
