import IsSupervisorSectionVisibleForOperations from './IsSupervisorSectionVisibleForOperations';
import WorkOrderOperationsSelectAllButtonVisible from '../../WorkOrders/Operations/WorkOrderOperationsSelectAllButtonVisible';
import WorkOrderOperationsDeselectAllButtonVisible from '../../WorkOrders/Operations/WorkOrderOperationsDeselectAllButtonVisible';

export default async function IsAssignOperationsActionBarItemVisible(context) {
    const [isSupervisorSectionVisible, isSelectAllVisible, isDeselectAllVisible] = await Promise.all([
        IsSupervisorSectionVisibleForOperations(context),
        WorkOrderOperationsSelectAllButtonVisible(context),
        WorkOrderOperationsDeselectAllButtonVisible(context),
    ]);
    return isSupervisorSectionVisible && !isSelectAllVisible && !isDeselectAllVisible;
}
