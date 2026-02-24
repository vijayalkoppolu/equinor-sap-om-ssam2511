export default function HUDelItemsDescription(context) {
    return context.binding.HandlingUnitExternalID ? [context.binding.KitIdentifier, context.binding.PackagingMaterial].filter(val => !!val).join(','): context.binding.KitIdentifier;
}

