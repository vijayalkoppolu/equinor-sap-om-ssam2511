import DueDate from './DueDate';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function IsPastDueDate(context) {
    let dueDateStr = DueDate(context);
    if (dueDateStr === context.localizeText('no_due_date')) {
        return '';
    }
    let dueDate = new Date(dueDateStr);
    let today = new Date();
    if (dueDate < today) {
        return 'Red';
    } else {
        return 'Green';
    }
}
