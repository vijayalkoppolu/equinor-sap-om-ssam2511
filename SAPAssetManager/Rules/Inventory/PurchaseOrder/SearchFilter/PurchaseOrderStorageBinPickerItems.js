import libFilter from '../../Common/Library/InventoryFilterLibrary';

/**
 * PO StorageBin Picker for search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of StorageBins
 */
export default async function PurchaseOrderStorageBinPickerItems(context) {
    const entitySet = 'PurchaseOrderItems';
    const queryOptions = `$filter=PurchaseOrderId eq '${context.binding.PurchaseOrderId}'&$orderby=ItemNum`;
    const propName = 'StorageBin';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
