import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * STO Delivery Due Date Picker for STO search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of STO Delivery Due Dates
 */
export default async function StockTransportOrderDeliveryDueDatePickerItems(context) {
    const entitySet = 'STOScheduleLines';
    const queryOptions = `$select=ItemNum,DeliveryDate&$filter=StockTransportOrderId eq '${context.binding.StockTransportOrderId}'&$orderby=ItemNum`;
    const propName = 'DeliveryDate';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
