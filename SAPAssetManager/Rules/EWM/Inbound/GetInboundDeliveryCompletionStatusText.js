/**
 * Get display text for CompletionStatus
 * @param {IClientAPI} context
 */

import { InboundDeliveryStatusValue } from '../Common/EWMLibrary';

export default function GetInboundDeliveryCompletionStatusText(context, binding = context.binding) {
    const completionStatus = binding?.CompletionStatusValue;
    let displayValue;

    switch (completionStatus) {
        case InboundDeliveryStatusValue.NotRelevant:
        case InboundDeliveryStatusValue.Partial:
        case InboundDeliveryStatusValue.NotStarted:
            displayValue = context.localizeText('not_started');
            break;
        case InboundDeliveryStatusValue.Completed:
            displayValue = context.localizeText('completed');
            break;
        default:
            displayValue = '-';
    }

    return displayValue;
}
