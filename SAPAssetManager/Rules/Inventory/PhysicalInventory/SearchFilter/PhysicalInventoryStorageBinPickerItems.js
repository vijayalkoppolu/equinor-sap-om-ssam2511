import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * PI StorageBin Picker for PI search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of PI Storage Bins
 */
export default async function PhysicalInventoryStorageBinPickerItems(context) {
    const entitySet = 'PhysicalInventoryDocItems';
    const queryOptions = `$select=StorageBin&$filter=PhysInvDoc eq '${context.binding.PhysInvDoc}'&$orderby=Item`;
    const propName = 'StorageBin';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
