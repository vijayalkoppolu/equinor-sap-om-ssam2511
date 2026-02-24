export default function WHInboundDeliveryBatchAndSer(context) {
    const batch = context.binding?.BatchNumber;
    const serialized = context.binding?.Serialized;
    const returnValue = [];

    if (batch) {
        returnValue.push(context.localizeText('ewm_batch_x', [batch]));
    }

    if (serialized) {
        returnValue.push(context.localizeText('pi_serialized'));
    }

    return returnValue.join(', ');
}
