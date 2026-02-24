import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * PI Counted Picker for PI search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of PI counted
 */
export default async function PhysicalInventoryCountedPickerItems(context) {
    const entitySet = 'PhysicalInventoryDocItems';
    const queryOptions = `$select=ItemCounted&$filter=PhysInvDoc eq '${context.binding.PhysInvDoc}'&$orderby=Item`;
    const propName = 'ItemCounted';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
