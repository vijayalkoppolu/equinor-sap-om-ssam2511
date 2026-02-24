/**
 * Get values for ProcessCategory list picker 
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of Queue and Description for list picker
 */
export default async function QueuePrickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseOrders', [], '$filter=WarehouseOrderQueue_Nav/Queue ne null&$select=Queue,WarehouseNo,WarehouseOrder,WarehouseOrderQueue_Nav/QueueText&$expand=WarehouseOrderQueue_Nav&$orderby=WarehouseOrder')
        .then(o => {
            return [...new Map(o.map(row => {
                const key = iter => iter.Queue;
                return [key(row), row];
            })).values()].map(v => (
                {
                    'ReturnValue': `${v.Queue}`,
                    'DisplayValue': `${v.WarehouseOrderQueue_Nav.QueueText}/${v.WarehouseNo}`,
                }
            ));
        });
}
