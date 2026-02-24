/**
 * Get display text for GRStatus
 * @param {IClientAPI} context
 */

import { InboundDeliveryStatusValue } from '../Common/EWMLibrary';

export default function GetInboundDeliveryStatusText(context) {
    const status = context.binding.GRStatusValue;

    if (status === InboundDeliveryStatusValue.NotStarted || status === InboundDeliveryStatusValue.Partial) {
        return context.localizeText('open');
    } else if (status === InboundDeliveryStatusValue.Completed) {
        return context.localizeText('completed');
    } else {
        return '-';
    }
}
