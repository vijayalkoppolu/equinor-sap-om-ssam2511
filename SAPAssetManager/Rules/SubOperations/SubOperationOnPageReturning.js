import ToolbarRefresh from '../Common/DetailsPageToolbar/ToolbarRefresh';
import ProgressTrackerOnDataChanged from '../TimelineControl/ProgressTrackerOnDataChanged';

export default function SubOperationOnPageReturning(context) {
    const operationSection = context.getControls()[0].getSection('OperationsObjectTable');
    if (operationSection) {
        operationSection.redraw(true);
    }
    return ToolbarRefresh(context).then(() => {
        return ProgressTrackerOnDataChanged(context);
    });
}
