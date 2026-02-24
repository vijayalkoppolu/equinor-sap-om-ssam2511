import libCommon from '../../Common/Library/CommonLibrary';
import OffsetODataDate from '../../Common/Date/OffsetODataDate';


export default function OperationDueDate(context) {
    const binding = context.binding;

    if (libCommon.isDefined(binding.SchedLatestEndDate)) {
        let odataDate = new OffsetODataDate(context, binding.SchedLatestEndDate, binding.SchedLatestEndTime);
        return context.formatDate(odataDate.date());
    } else {
        return context.localizeText('no_due_date');
    }
}
