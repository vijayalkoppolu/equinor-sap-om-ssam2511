import libFilter from '../../../Inventory/Common/Library/InventoryFilterLibrary';
/**
 * PI WO Picker for EWM Inventory search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of WO items
 */
export default async function PIWarehouseOrderPickerItems(context) {
    const entitySet = 'WarehousePhysicalInventoryItems';
    const queryOptions = '$expand=WarehousePhysicalInventory_Nav&$select=WarehousePhysicalInventory_Nav/WarehouseOrder&$orderby=WarehousePhysicalInventory_Nav/WarehouseOrder';
    const propName = 'WarehouseOrder';
    const navName = 'WarehousePhysicalInventory_Nav';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName, navName);
}


