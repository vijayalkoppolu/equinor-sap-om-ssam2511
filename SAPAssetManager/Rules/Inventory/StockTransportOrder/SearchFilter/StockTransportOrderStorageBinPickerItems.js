import libFilter from '../../Common/Library/InventoryFilterLibrary';

/**
 * STO StorageBin Picker for search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of StorageBins
 */
export default async function StockTransportOrderStorageBinPickerItems(context) {
    const entitySet = 'StockTransportOrderItems';
    const queryOptions = `$filter=StockTransportOrderId eq '${context.binding.StockTransportOrderId}'&$orderby=ItemNum`;
    const propName = 'StorageBin';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
