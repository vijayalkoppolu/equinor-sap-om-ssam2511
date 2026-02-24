import { formatDate } from '../ReturnsByProduct/ProductCellDescription';

export default function ReadyToPackDeliveryDueDateValue(context) {
    return formatDate(context.binding.FldLogsDelivDueDate);
}
