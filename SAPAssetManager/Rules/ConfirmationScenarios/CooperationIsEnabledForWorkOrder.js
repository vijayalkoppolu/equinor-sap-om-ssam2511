import libConfirm from './ConfirmationScenariosLibrary';
import ConfirmationIsEnabledForThisObject from './ConfirmationIsEnabledForThisObject';

/**
 * Is the cooperation scenario available for this user and this workorder?
 * @param {} context 
 * @returns 
 */
export default async function CooperationIsEnabledForWorkOrder(context, plantOverride, orderTypeOverride) {
    const scenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/Cooperation.global').getValue();
        
    if (await ConfirmationIsEnabledForThisObject(context)) {
        return await libConfirm.scenarioIsEnabledForWorkOrder(context, scenario, plantOverride, orderTypeOverride);
    }
        
    return false;
}
