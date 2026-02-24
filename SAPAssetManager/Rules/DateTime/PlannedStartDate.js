import FormatLibrary from '../Common/Library/FormatLibrary';

export default function PlannedStartDate(context) {
    return FormatLibrary.formatDateTimeToShortFormatWithOffset(context, context.binding?.PlannedStartDate);
}
