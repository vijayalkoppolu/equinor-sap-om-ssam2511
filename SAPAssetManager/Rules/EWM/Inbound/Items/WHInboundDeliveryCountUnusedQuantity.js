export default async function WHInboundDeliveryCountUnusedQuantity(context, binding = context.getActionBinding?.() || context.binding) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/WarehouseTask_Nav`, ['Quantity'], '').then(result => {
        const items = result?.slice() || [];
        const total = items.reduce((sum, item) => sum + Number(item.Quantity), 0);
        const value = binding.Quantity - total;
        return String(value > 0 ? value : 0);
    }).catch(error => {
        console.error('Task Quantity count error:', error);
        return '0';
    });
}
