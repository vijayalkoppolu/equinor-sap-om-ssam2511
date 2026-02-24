import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * Purchase Order CostCenter Picker for PO search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of PO CostCenters
 */
export default async function PurchaseOrderCostCenterPickerItems(context) {
    const entitySet = 'PurchaseOrderItems';
    const queryOptions = `$select=ItemNum,CostCenter&$filter=PurchaseOrderId eq '${context.binding.PurchaseOrderId}'&$orderby=ItemNum`;
    const propName = 'CostCenter';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
