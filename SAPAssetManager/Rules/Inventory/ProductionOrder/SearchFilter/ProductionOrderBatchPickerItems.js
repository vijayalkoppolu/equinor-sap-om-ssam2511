import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * Production Order Batch Picker for PO search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of PO batches
 */
export default async function ProductionOrderBatchPickerItems(context) {
    const entitySet = 'ProductionOrderComponents';
    const queryOptions = `$select=Batch&$filter=OrderId eq '${context.binding.OrderId}'&$orderby=ItemNum`;
    const propName = 'Batch';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
