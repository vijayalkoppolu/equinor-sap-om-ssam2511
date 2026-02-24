/**
 * Purchase Order Picker for Inbound Delivery filter
 */
export default async function PurchaseOrderPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseInboundDeliveries', [], '$select=PurchaseOrder&$orderby=PurchaseOrder')
        .then(results => {
            const uniquePurchaseOrders = [...new Set(Array.from(results, item => item.PurchaseOrder))];
            return uniquePurchaseOrders.map(po => ({
                DisplayValue: `${po}`,
                ReturnValue: `${po}`,
            }));
        });
}
