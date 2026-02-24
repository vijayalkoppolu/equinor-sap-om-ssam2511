export default function IDBSerialNumberQuantityValue(context) {
    const editPageProxy = context.evaluateTargetPathForAPI('#Page:EditInboundDeliveryItemPage');
    const quantity = editPageProxy?.getControl('EditInboundDeliveryTable')?.getControl('QuantityInput')?.getValue();
    const uom = context.binding.UnitofMeasure;
    return `${quantity} ${uom ? uom : ''}`;
}
