
import FormatLibrary from '../../Common/Library/FormatLibrary';

export default function FormatRequestedDeliveryDate(context) {
    return FormatLibrary.formatDateTimeToShortFormatWithOffset(context, context.binding?.RequestedShippingDate);
}
