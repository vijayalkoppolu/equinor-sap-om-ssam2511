/**
 * Work Order Picker for Inbound Delivery filter
 */
export default async function WorkOrderPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseInboundDeliveries', [], '$select=MaintenanceOrder&$orderby=MaintenanceOrder')
        .then(results => {
            const uniqueWorkOrders = [...new Set(Array.from(results, item => item.MaintenanceOrder))];
            return uniqueWorkOrders
                .filter(wo => wo)
                .map(wo => ({
                    DisplayValue: `${wo}`,
                    ReturnValue: `${wo}`,
                }));
        });
}
