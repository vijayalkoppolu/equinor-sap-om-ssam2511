import libFilter from '../../../Inventory/Common/Library/InventoryFilterLibrary';
/**
 * PI Strorage Bin Picker for EWM Inventory search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of StorageBin items
 */
export default async function PIStorageBinPickerItems(context) {
    const entitySet = 'WarehousePhysicalInventoryItems';
    const queryOptions = '$select=StorageBin&$orderby=StorageBin';
    const propName = 'StorageBin';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
