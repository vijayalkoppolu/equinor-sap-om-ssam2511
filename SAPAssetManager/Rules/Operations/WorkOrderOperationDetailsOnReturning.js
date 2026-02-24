import progressTrackerUpdate from '../TimelineControl/ProgressTrackerOnDataChanged';
import ToolbarRefresh from '../Common/DetailsPageToolbar/ToolbarRefresh';

export default function WorkOrderOperationDetailsOnReturning(context) {
    return ToolbarRefresh(context)
        .then(() => progressTrackerUpdate(context))
        .then(() => context.redraw());
}
