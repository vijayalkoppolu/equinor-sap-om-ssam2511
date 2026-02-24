export default function WHInboundDeliveryItemNumAndProduct(context, binding = (context.getActionBinding?.() || context.binding)) {
    const itemNum = binding?.ItemNumber?.replace(/^0+/, '');
    const product = binding?.Product;

    const result = [itemNum, product].filter(Boolean).join(' - ');
    return result || '-';
}
