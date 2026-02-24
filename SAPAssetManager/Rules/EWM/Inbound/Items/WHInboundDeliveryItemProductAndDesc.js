export default function WHInboundDeliveryItemProductAndDesc(context) {
    const binding = context.getActionBinding?.() || context.binding;
    
    const product = binding?.Product;
    const itemDesc = binding?.ProductDescription;

    const result = [product, itemDesc].filter(Boolean).join(' - ');
    return result || '-';
}
