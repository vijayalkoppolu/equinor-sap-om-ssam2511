import libConfirm from './ConfirmationScenariosLibrary';
import ConfirmationScenariosFeatureIsEnabled from './ConfirmationScenariosFeatureIsEnabled';

/**
 * Is any scenario available for this workorder?
 * @param {} context 
 * @returns 
 */
export default async function AnyScenarioIsEnabledForWorkOrder(context, plantOverride, orderTypeOverride) {
     const coopScenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/Cooperation.global').getValue();
     const doubleScenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/DoubleCheck.global').getValue();
        
     if (ConfirmationScenariosFeatureIsEnabled(context)) {
        if (await libConfirm.scenarioIsEnabledForWorkOrder(context, coopScenario, plantOverride, orderTypeOverride)) {
            return true;
        }
        
        if (await libConfirm.scenarioIsEnabledForWorkOrder(context, doubleScenario, plantOverride, orderTypeOverride)) {
            return true;
        }
    }
        
    return false; //feature is disabled
}
