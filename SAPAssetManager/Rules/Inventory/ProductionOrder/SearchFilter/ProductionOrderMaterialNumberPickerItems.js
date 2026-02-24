import libFilter from '../../Common/Library/InventoryFilterLibrary';

/**
 * Production Order Material Number Picker for PO search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of material numbers
 */
export default async function ProductionOrderMaterialNumberPickerItems(context) {
        const entitySet = 'ProductionOrderComponents';
        const queryOptions = `$select=MaterialNum&$filter=OrderId eq '${context.binding.OrderId}'&$orderby=ItemNum`;
        const propName = 'MaterialNum';
        return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
