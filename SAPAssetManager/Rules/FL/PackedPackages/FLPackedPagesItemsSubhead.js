export default function FLPackedPagesItemsSubhead(context) {
    const delivery = context.binding.DeliveryDocument;
    const hu = context.binding.HandlingUnitExternalID;
    if (delivery && hu) {
        return `${delivery} , ${hu}`;
    } else if (delivery) {
        return delivery;
    } else if (hu) {
        return hu;
    }
    return '';
}
