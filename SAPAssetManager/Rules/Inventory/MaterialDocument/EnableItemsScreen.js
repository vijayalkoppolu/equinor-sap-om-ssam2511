import ODataLibrary from '../../OData/ODataLibrary';

export default function EnableItemsScreen(context) {
    let binding = context.binding;
    if (binding) {
        if (!binding.MovementType) {
            binding = binding.RelatedItem[0];
        }
        if (!binding.PurchaseOrder_Nav && !binding.STO_Nav && !binding.ProductionOrderItem_Nav && !binding.ProductionOrderComponent_Nav && !binding.Reservation_Nav) {
            return ODataLibrary.isLocal(context.binding);
        }
    }
    return false;
}
