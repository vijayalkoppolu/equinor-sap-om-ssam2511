import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * PI Materil for PI search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of PI Materal
 */
export default async function PhysicalInventoryMaterialPickerItems(context) {
    const entitySet = 'PhysicalInventoryDocItems';
    const queryOptions = `$select=Material&$filter=PhysInvDoc eq '${context.binding.PhysInvDoc}'&$orderby=Item`;
    const propName = 'Material';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
