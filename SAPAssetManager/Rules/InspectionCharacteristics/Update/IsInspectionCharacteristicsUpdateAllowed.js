import ODataLibrary from '../../OData/ODataLibrary';

export default function IsInspectionCharacteristicsUpdateAllowed(context) {
    let binding = context.binding;
    let status = binding.InspectionLot_Nav.SystemStatus;
    if (usageDecisionPending(binding.InspectionLot_Nav) || checkAnyInspectionCharIsLocal(binding)) {
        if (!status.startsWith('UD') || ODataLibrary.hasAnyPendingChanges(binding.InspectionLot_Nav) || checkAnyInspectionCharIsLocal(binding)) {
            return true;
        }
    }
    return false;
}

/**
 * Determines whether or not a usage decision is pending or not recorded
 * This can be one or more of the following:
 * 1. Inspection Lot has no Usage Decision -- UDCatalog, UDCode, UDCodeGroup, and UDSelectedSet are all blank
 * 2. Inspection Lot has a Usage Decision set, but is still local
 * @param {Object} binding Inspection Lot binding
 * @returns {Boolean} true if usage decision is pending, false if otherwise
 */
function usageDecisionPending(binding) {
    if (binding.UDCatalog === '' && binding.UDCode === '' && binding.UDCodeGroup === '' && binding.UDSelectedSet === '') {
        return true;
    } else {
        return ODataLibrary.hasAnyPendingChanges(binding);
    }
}

function checkAnyInspectionCharIsLocal(binding) {
    if (binding && binding.InspectionLot_Nav && binding.InspectionLot_Nav.InspectionChars_Nav) {
        for (let item of binding.InspectionLot_Nav.InspectionChars_Nav) {
            if (ODataLibrary.hasAnyPendingChanges(item)) {
                return true;
            }
        }
        return false;
    }
    return false;
}
