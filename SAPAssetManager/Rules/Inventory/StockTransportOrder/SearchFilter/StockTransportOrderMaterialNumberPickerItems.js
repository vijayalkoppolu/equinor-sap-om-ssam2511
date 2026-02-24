import libFilter from '../../Common/Library/InventoryFilterLibrary';

/**
 * StockTransport Order Material Number Picker for PO search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of material numbers
 */
export default async function StockTransportOrderMaterialNumberPickerItems(context) {
        const entitySet = 'StockTransportOrderItems';
        const queryOptions = `$filter=StockTransportOrderId eq '${context.binding.StockTransportOrderId}'&$orderby=ItemNum`;
        const propName = 'MaterialNum';
        return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
