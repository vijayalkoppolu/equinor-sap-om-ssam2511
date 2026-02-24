export default function GetInboundDeliveryFootnote(context) {
    let rawDate = context.binding.PlannedDeliveryDate;

    if (!rawDate) {
        return '-';
    }
    let formattedDate = context.formatDate(rawDate);

    return context.localizeText('delivery_x', [formattedDate]);
}
