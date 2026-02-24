import IsListNotInSelectionMode from '../../Common/IsListNotInSelectionMode';
import ConfirmationCreateIsEnabled from '../../Confirmations/CreateUpdate/ConfirmationCreateIsEnabled';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import TimeSheetCreateIsEnabled from '../../TimeSheets/TimeSheetCreateIsEnabled';
import WorkOrderStartedOrOperationLevelAssignment from './WorkOrderStartedOrOperationLevelAssignment';

export default function WorkOrderOperationsDefaultModeButtonVisible(context) {
	return areBulkConfirmationsAllowed(context) && IsListNotInSelectionMode(context) && WorkOrderStartedOrOperationLevelAssignment(context);
}

export function areBulkConfirmationsAllowed(context) {
	if (PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isFieldServiceTechnicianInCSMode(context)) {
		return ConfirmationCreateIsEnabled(context) || TimeSheetCreateIsEnabled(context);
	}
	return false;
}
