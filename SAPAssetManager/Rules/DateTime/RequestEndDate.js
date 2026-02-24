import FormatLibrary from '../Common/Library/FormatLibrary';

export default function RequestEndDate(context) {
    const binding = context.binding;

    if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        return FormatLibrary.formatDateTimeToShortFormatWithOffset(context, binding?.RequestedEnd, undefined, context.localizeText('no_request_end_date'));
    }

    return FormatLibrary.formatDateToShortFormatWithOffset(context, binding?.RequestedEnd, context.localizeText('no_request_end_date'));
}
