import FormatLibrary from '../Common/Library/FormatLibrary';

export default function PlannedEndDate(context) {
    return FormatLibrary.formatDateTimeToShortFormatWithOffset(context, context.binding?.PlannedEndDate);
}
