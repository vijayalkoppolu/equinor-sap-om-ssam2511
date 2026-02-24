import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * Purchase Order Delivery Due Date Picker for PO search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of PO Delivery Due Dates
 */
export default async function PurchaseOrderDeliveryDueDatePickerItems(context) {
    const entitySet = 'ScheduleLines';
    const queryOptions = `$select=ItemNum,DeliveryDate&$filter=PurchaseOrderId eq '${context.binding.PurchaseOrderId}'&$orderby=ItemNum`;
    const propName = 'DeliveryDate';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
