/**
 * LE Delivery Number Picker for Inbound Delivery filter
 */
export default async function LEDeliveryPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseInboundDeliveries', [], '$select=LEDeliveryNum&$orderby=LEDeliveryNum')
        .then(results => {
            const uniqueLEDNs = [...new Set(Array.from(results, item => item.LEDeliveryNum))];
            return uniqueLEDNs
                .filter(le => le)
                .map(le => ({
                    DisplayValue: `${le}`,
                    ReturnValue: `${le}`,
                }));
        });
}
