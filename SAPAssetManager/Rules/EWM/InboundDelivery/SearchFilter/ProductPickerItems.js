export default async function ProductPickerItems(context) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseInboundDeliveryItems', [], '$select=Product')
        .then(o => [... new Set(Array.from(o, c => c.Product))]
        .map(uniqueValue => ({
            'DisplayValue': `${uniqueValue}`,
            'ReturnValue': `${uniqueValue}`,
        })));
}
