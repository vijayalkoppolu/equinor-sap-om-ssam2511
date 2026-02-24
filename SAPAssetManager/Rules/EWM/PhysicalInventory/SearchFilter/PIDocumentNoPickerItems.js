import libFilter from '../../../Inventory/Common/Library/InventoryFilterLibrary';
/**
 * PI Document Picker for EWM Inventory search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of PI Document items
 */
export default async function PIDocumentNoPickerItems(context) {
    const entitySet = 'WarehousePhysicalInventoryItems';
    const queryOptions = '$expand=WarehousePhysicalInventory_Nav&$select=WarehousePhysicalInventory_Nav/PIDocumentNo&$orderby=WarehousePhysicalInventory_Nav/PIDocumentNo';
    const propName = 'PIDocumentNo';
    const navName = 'WarehousePhysicalInventory_Nav';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName, navName);
}
