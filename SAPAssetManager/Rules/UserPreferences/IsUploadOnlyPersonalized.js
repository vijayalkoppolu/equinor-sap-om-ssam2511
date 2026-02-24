import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';

export default function IsUploadOnlyPersonalized(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/SyncProfile/UploadOnly.global').getValue());
}
