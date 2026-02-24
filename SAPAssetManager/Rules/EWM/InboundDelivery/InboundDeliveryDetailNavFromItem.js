export default function InboundDeliveryDetailNavFromItem(context, binding = context.binding) {
    const inboundDelivery = binding?.WarehouseInboundDelivery_Nav;
    const pageProxy = context.getPageProxy();
    pageProxy.setActionBinding(inboundDelivery);
    return context.executeAction('/SAPAssetManager/Actions/EWM/Inbound/WHInboundDeliveryDetailNav.action');
}
