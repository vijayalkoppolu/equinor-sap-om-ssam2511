import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * Purchase Order GLAccount Picker for PO search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of PO GLAccounts
 */
export default async function PurchaseOrderGLAccountPickerItems(context) {
    const entitySet = 'PurchaseOrderItems';
    const queryOptions = `$select=ItemNum,GLAccount&$filter=PurchaseOrderId eq '${context.binding.PurchaseOrderId}'&$orderby=ItemNum`;
    const propName = 'GLAccount';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
