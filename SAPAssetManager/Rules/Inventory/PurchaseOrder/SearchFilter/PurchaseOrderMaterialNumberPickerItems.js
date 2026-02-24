import libFilter from '../../Common/Library/InventoryFilterLibrary';

/**
 * Purchase Order Material Number Picker for PO search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of material numbers
 */
export default async function PurchaseOrderMaterialNumberPickerItems(context) {
        const entitySet = 'PurchaseOrderItems';
        const queryOptions = `$filter=PurchaseOrderId eq '${context.binding.PurchaseOrderId}'&$orderby=ItemNum`;
        const propName = 'MaterialNum';
        return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
