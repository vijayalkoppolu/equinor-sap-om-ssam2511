export default function GetInboundDeliveryDescription(context) {
    const binding = context.binding;
    const fields = [
        { label: 'PO', value: binding.PurchaseOrder },
        { label: 'LE', value: binding.LEDeliveryNum },
        { label: 'ASN', value: binding.ASN },
        { label: 'BOL', value: binding.BillOfLading },
    ];

    if (binding.ManufactOrder) {
        fields.push({ label: 'WO', value: binding.ManufactOrder });
    } else if (binding.MaintenanceOrder) {
        fields.push({ label: 'WO', value: binding.MaintenanceOrder });
    }

    const mainLine = fields
        .filter(f => f.value)
        .map(f => `${f.label}: ${f.value}`)
        .join(' / ');

    return mainLine;
}
