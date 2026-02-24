import libFilter from '../../../Inventory/Common/Library/InventoryFilterLibrary';
/**
 * PI Area Picker for EWM Inventory search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of area items
 */
export default async function PIAreaPickerItems(context) {
    const entitySet = 'WarehousePhysicalInventoryItems';
    const queryOptions = '$select=PhysInvAreaDesc&$orderby=PhysInvAreaDesc';
    const propName = 'PhysInvAreaDesc';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
