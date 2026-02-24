
export default function BatchEquipmentNum(context) {
    const pageProxy = context.getPageProxy();
    const binding = pageProxy.binding;
    return binding.BatchEquipmentNum ? binding.BatchEquipmentNum : pageProxy.getClientData().BatchEquipmentNum;
}
