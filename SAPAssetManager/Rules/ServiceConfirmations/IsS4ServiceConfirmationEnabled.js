import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';

export default function IsS4ServiceConfirmationEnabled(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/S4ServiceConfirmation.global').getValue());
}
