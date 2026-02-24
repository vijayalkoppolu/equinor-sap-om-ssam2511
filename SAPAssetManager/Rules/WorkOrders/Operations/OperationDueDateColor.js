/**
* Describe this function...
* @param {IClientAPI} context
*/
import OperationDueDate from './OperationDueDate';
export default function OperationDueDateColor(context) {
    let dueDateStr = OperationDueDate(context);
    let dueDate = new Date(dueDateStr);
    let today = new Date();
    if (dueDate < today) {
        return 'Red';
    } else {
        return 'Green';
    }
}
