import libConfirm from './ConfirmationScenariosLibrary';
import ConfirmationIsEnabledForThisObject from './ConfirmationIsEnabledForThisObject';

/**
 * Is the double check scenario available for this user and this workorder?
 * @param {} context 
 * @returns 
 */
export default async function DoubleCheckIsEnabledForWorkOrderWrapper(context, plantOverride, orderTypeOverride) {
    const scenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/DoubleCheck.global').getValue();
    
    if (await ConfirmationIsEnabledForThisObject(context)) { //First check confirmation create is enabled
        return await libConfirm.scenarioIsEnabledForWorkOrder(context, scenario, plantOverride, orderTypeOverride);
    }
    
    return false;
}
