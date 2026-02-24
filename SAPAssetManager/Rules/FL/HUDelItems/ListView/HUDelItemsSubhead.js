export default function HUDelItemsSubhead(context) {
    return context.binding.HandlingUnitExternalID ? context.binding.HandlingUnitExternalID : context.binding.ReferenceDocNumber;
}
