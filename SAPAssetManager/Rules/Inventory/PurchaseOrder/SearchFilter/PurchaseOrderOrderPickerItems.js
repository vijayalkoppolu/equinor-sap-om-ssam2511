import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * Purchase Order WorkOrder Picker for PO search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of PO Orders
 */
export default async function PurchaseOrderOrderPickerItems(context) {
    const entitySet = 'PurchaseOrderItems';
    const queryOptions = `$select=ItemNum,Order&$filter=PurchaseOrderId eq '${context.binding.PurchaseOrderId}'&$orderby=ItemNum`;
    const propName = 'Order';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
