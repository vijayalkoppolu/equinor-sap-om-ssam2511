import ConfirmationScenariosFeatureIsEnabled from '../../ConfirmationScenarios/ConfirmationScenariosFeatureIsEnabled';
import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

/**
 * If this is a cooperation or double-check confirmation, return the custom omdo for SAM 2505+
 * Otherwise return a dummy that backend will ignore (It cannot be left blank)
 * @param {} context 
 * @returns 
 */
export default function ConfirmationCreateGetOMDOID(context) {
    try {
        let binding = context.binding;
        const coopScenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/Cooperation.global').getValue();
        const doubleScenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/DoubleCheck.global').getValue();
    
        if (ConfirmationScenariosFeatureIsEnabled(context)) {
            if (binding.ConfirmationScenario === coopScenario || binding.isCooperation || binding.ConfirmationScenario === doubleScenario || binding.isDoubleCheck) {
                return libCom.getAppParam(context, 'CONFIRMATION_SCENARIOS', 'PM_EAM_CONFIRMATION_OMDO');
            }
        }
    } catch (e) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryConfirmationScenarios.global').getValue(), 'ConfirmationCreateGetOMDOID: ' + e);
    }

    return 'DUMMYIGNORE'; // Dummy value that backend will ignore
}
