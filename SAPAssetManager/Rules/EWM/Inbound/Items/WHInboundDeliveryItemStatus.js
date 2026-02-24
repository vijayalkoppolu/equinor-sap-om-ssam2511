import { InboundDeliveryStatusValue } from '../../Common/EWMLibrary';

export default function WHInboundDeliveryItemStatus(context) {
    const status = context.binding?.GRStatusValue;
    return status === InboundDeliveryStatusValue.Completed ? context.localizeText('completed') : context.localizeText('open');
}
