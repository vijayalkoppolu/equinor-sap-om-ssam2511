import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * PI Batch Picker for PI search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of PI batches
 */
export default async function PhysicalInventoryBatchPickerItems(context) {
    const entitySet = 'PhysicalInventoryDocItems';
    const queryOptions = `$select=Batch&$filter=PhysInvDoc eq '${context.binding.PhysInvDoc}'&$orderby=Item`;
    const propName = 'Batch';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
