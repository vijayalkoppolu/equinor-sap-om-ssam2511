import UserFeaturesLibrary from '../../UserFeatures/UserFeaturesLibrary';

export default function IsS4ServiceRequestFeatureEnabled(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/S4ServiceRequest.global').getValue());
}
