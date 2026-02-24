import libCom from '../../Common/Library/CommonLibrary';

/**
 * Checks if technician is allowed to enter time for another technician
 * This is enabled if the app parameter is set to 'Y' or if the confirmation scenario is '10' or if the confirmation is a cooperation
 * @param {*} context 
 * @param {*} ignoreCooperation - Do not check for cooperation
 * @returns 
 */
export default function IsAnotherTechnicianSelectEnabled(context, ignoreCooperation = false) {
    let binding = context.binding;
    const coopScenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/Cooperation.global').getValue();
    const doubleScenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/DoubleCheck.global').getValue();

    if (!binding) {
        binding = context.getPageProxy()?.getActionBinding();
    }

    let auth = libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.TimeEntryForOthers') === 'Y';
    let coop;

    if (ignoreCooperation) {
        coop = false;
    } else {
        coop = binding ? !!(binding.ConfirmationScenario === coopScenario || binding.isCooperation || binding.ConfirmationScenario === doubleScenario || binding.isDoubleCheck): false;
    }
    
    return (auth || coop);
}
