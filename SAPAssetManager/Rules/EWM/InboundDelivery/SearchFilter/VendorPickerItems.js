/**
 * Vendor Picker for Inbound Delivery filter
 */
export default async function VendorPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseInboundDeliveries', [], '$select=Vendor&$orderby=Vendor')
        .then(results => {
            const uniqueVendors = [...new Set(Array.from(results, item => item.Vendor))];
            return uniqueVendors.map(vendor => ({
                DisplayValue: `${vendor}`,
                ReturnValue: `${vendor}`,
            }));
        });
}
