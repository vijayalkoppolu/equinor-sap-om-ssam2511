import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * Purchase Order Items Number Picker for PO search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of PO numbers
 */
export default async function PurchaseOrderNumberPickerItems(context) {
    const entitySet = 'PurchaseOrderItems';
    const queryOptions = `$filter=PurchaseOrderId eq '${context.binding.PurchaseOrderId}'&$orderby=ItemNum`;
    const propName = 'ItemNum';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
