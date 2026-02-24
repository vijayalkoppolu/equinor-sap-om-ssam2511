import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

/**
* Check if FSM Integration is enabled or not
* @param {IClientAPI} context
*/
export default function IsFSMIntegrationEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/FSMIntegration.global').getValue());
}
