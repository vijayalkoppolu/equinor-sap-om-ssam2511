import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';

export default function AIJobCompletionSwitchVisible(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/AIJobComplete.global').getValue());
}
