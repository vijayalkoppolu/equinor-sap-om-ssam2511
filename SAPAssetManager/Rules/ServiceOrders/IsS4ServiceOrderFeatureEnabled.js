import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';

export default function IsS4ServiceOrderFeatureEnabled(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/S4ServiceOrder.global').getValue());
}
