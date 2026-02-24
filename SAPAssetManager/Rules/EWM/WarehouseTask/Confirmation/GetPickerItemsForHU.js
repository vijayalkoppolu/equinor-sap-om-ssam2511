import libFilter from '../../../Inventory/Common/Library/InventoryFilterLibrary';

export default function GetPickerItemsForHU(context) {
    const entitySet = 'WarehousePickHUs';
    const warehouseOrder = context.binding.WarehouseOrder;
    const queryOptions = `$filter=WarehouseOrder eq '${warehouseOrder}'&$orderby=HandlingUnit`;
    const propName = 'HandlingUnit';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
