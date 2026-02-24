export default function WHHandlingUnitType(context) {
    const type = context.binding?.Header_Nav?.HUType || '-';
    return `${context.localizeText('hu_type')}: ${type}`;
}
