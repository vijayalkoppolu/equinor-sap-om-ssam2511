import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * Production Order Items Number Picker for PO search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of PO numbers
 */
export default async function ProductionOrderNumberPickerItems(context) {
    const entitySet = 'ProductionOrderComponents';
    const queryOptions = `$select=ItemNum&$filter=OrderId eq '${context.binding.OrderId}'&$orderby=ItemNum`;
    const propName = 'ItemNum';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
