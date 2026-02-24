import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * PI Items Picker for PI search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of PI items
 */
export default async function PhysicalInventoryItemPickerItems(context) {
    const entitySet = 'PhysicalInventoryDocItems';
    const queryOptions = `$select=Item&$filter=PhysInvDoc eq '${context.binding.PhysInvDoc}'&$orderby=Item`;
    const propName = 'Item';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
