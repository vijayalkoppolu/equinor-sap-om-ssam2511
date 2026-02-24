import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';

/**
 * Is the Confirmation Scenarios feature enabled?
 * @param {} context 
 * @returns 
 */
export default function ConfirmationScenariosFeatureIsEnabled(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/ConfirmationScenarios.global').getValue());
}
