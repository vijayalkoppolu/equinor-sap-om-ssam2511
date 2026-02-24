import AddPurchaseRequisitionNav from '../PurchaseRequisition/AddPurchaseRequisitionNav';

/** @param {IPageProxy & {binding: MaterialSLoc}} context  */
export default function AddPurchaseRequisitionNavFromStockDetails(context) {
    const binding = context.binding;
    context.setActionBinding({
        Material: binding.Material.MaterialNum,
        Plant: binding.Plant,
        StorageLocation: binding.StorageLocation,
        BaseUOM: binding.Material.BaseUOM,
    });
    return AddPurchaseRequisitionNav(context);
}
