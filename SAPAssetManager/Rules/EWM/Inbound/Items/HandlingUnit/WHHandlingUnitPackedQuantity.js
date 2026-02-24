export default function WHHandlingUnitPackedQuantity(context) {
    const qty = context.binding?.PackedQuantity ?? '-';
    const uom = context.binding?.QuantityUoM;
    
    return  `${qty}${uom ? ' ' + uom : ''}`;
}
