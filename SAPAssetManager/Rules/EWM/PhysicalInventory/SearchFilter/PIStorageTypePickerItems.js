import libFilter from '../../../Inventory/Common/Library/InventoryFilterLibrary';
/**
 * PI Storage Type Picker for EWM Inventory search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of Storage Type items
 */
export default async function PIAreaOrderPickerItems(context) {
    const entitySet = 'WarehousePhysicalInventoryItems';
    const queryOptions = '$select=StorageType&$orderby=StorageType';
    const propName = 'StorageType';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
