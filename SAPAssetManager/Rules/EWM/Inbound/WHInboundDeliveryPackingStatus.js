import { InboundDeliveryStatusValue } from '../Common/EWMLibrary';

export default function WHInboundDeliveryPackingStatus(context, statusValue) {
    const packingStatus = statusValue || context.binding?.PackingStatusValue;
    let displayValue;

    switch (packingStatus) {
        case InboundDeliveryStatusValue.NotRelevant:
            displayValue = context.localizeText('not_packable');
            break;
        case InboundDeliveryStatusValue.NotStarted:
        case InboundDeliveryStatusValue.Partial:
            displayValue = context.localizeText('unpacked');
            break;
        case InboundDeliveryStatusValue.Completed:
            displayValue = context.localizeText('packed');
            break;
        default:
            displayValue = '-';
    }

    return displayValue;

}
