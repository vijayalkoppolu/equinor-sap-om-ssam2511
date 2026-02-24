import libFilter from '../../Common/Library/InventoryFilterLibrary';

/**
 * PO StorageBin Picker for search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of StorageBins
 */
export default async function ProductionOrderStorageBinPickerItems(context) {
    const entitySet = 'ProductionOrderComponents';
    const queryOptions = `$select=StorageBin&$filter=OrderId eq '${context.binding.OrderId}'&$orderby=ItemNum`;
    const propName = 'StorageBin';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
