export default function IsProductSerialized(context) {
    // Check if the product is serialized by looking at the SerialNumber property
    return !!(context.binding.IsSerialized);
}
