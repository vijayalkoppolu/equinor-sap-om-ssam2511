import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * STO Item Number Picker for PO search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of STO item numbers
 */
export default async function StockTransportOrderNumberPickerItems(context) {
    const entitySet = 'StockTransportOrderItems';
    const queryOptions = `$filter=StockTransportOrderId eq '${context.binding.StockTransportOrderId}'&$orderby=ItemNum`;
    const propName = 'ItemNum';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
