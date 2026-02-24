export default function WHHandlingUnitProductAndDesc(context) {
    const product = context.binding?.Header_Nav?.PackingMaterial;
    const itemDesc = context.binding?.Header_Nav?.PackingMaterialDesc;

    const result = [product, itemDesc].filter(Boolean).join(' - ');
    return result || '-';
}
