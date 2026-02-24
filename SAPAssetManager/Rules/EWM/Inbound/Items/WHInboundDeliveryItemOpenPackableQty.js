export default function WHInboundDeliveryItemOpenPackableQty(context, binding = context.binding) {
    return formatQtyWithUOM(binding?.OpenPackableQuantity, binding?.UnitofMeasure);
}

export function formatQtyWithUOM(qty, uom) {
    const text = qty == null ? '-' : qty;
    return `${text}${uom ? ' ' + uom : ''}`;
}
