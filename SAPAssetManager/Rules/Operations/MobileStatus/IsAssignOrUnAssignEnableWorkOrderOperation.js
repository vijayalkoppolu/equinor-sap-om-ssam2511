import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import isSupervisorSectionVisibleForOperations from '../../Supervisor/SupervisorRole/IsSupervisorSectionVisibleForOperations';
import ODataLibrary from '../../OData/ODataLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function IsAssignOrUnAssignEnableWorkOrderOperation(context) {
    return isSupervisorSectionVisibleForOperations(context).then(function(visible) {
        if (!visible) {
            return false;
        }
        return ValidationLibrary.evalIsEmpty(context.binding.Employee_Nav) || (!ValidationLibrary.evalIsEmpty(context.binding.Employee_Nav) && ODataLibrary.hasAnyPendingChanges(context.binding));
    });
}
