import OperationHeaderPriorityColor from '../../Operations/OperationHeaderPriorityColor';
import libPhase from '../../PhaseModel/PhaseLibrary';
import PhaseControlVisible from '../PhaseControl/PhaseControlVisible';

/**
* Add styling to SubstatusText, if priority is displayed
* @param {IClientAPI} context
*/
export default function OperationsListViewSubstatusTextStyle(context) {
    return libPhase.isPhaseModelActiveInDataObject(context, context.binding).then(isPhaseOrder => {
        if (isPhaseOrder && PhaseControlVisible(context) && context.binding) {
            return '';
        }
        return OperationHeaderPriorityColor(context);
    });
}
