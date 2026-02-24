export default function WHInboundDeliveryItemCount(context) {
    const binding = context.binding;
    return binding ? context.count('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/WarehouseInboundDeliveryItem_Nav`, '') : '-';
}
