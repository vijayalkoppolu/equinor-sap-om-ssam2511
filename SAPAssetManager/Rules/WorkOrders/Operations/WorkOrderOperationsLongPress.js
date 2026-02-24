import { areBulkConfirmationsAllowed } from './WorkOrderOperationsDefaultModeButtonVisible';
import WorkOrderStartedOrOperationLevelAssignment from './WorkOrderStartedOrOperationLevelAssignment';

export default function WorkOrderOperationsLongPress(context) {
    return areBulkConfirmationsAllowed(context) && WorkOrderStartedOrOperationLevelAssignment(context) ? 'Multiple' : 'None';
}
