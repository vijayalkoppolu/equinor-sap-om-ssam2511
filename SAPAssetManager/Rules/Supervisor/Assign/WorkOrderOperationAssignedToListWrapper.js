import SplitAssignmentText from '../../WorkOrders/Operations/SplitAssignmentText';
import assignedTo from './WorkOrderOperationAssignedTo';

export default async function WorkOrderOperationAssignedToListWrapper(context) {
    const operation = context.binding;
    let description = '';

    //if splits exists then show the split assignment text instead of the operation assigned to
    description = await SplitAssignmentText(context, operation);

    if (description) {
       return description;
    } else {
        return assignedTo(context).then((result) => {
            if (result === context.localizeText('unassigned') || result === '00000000') {
                return context.localizeText('unassigned');
            }
            return context.localizeText('assignedto') + ' ' + result;
        });
    }
}
