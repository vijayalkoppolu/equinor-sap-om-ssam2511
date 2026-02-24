import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';

export default function IsS4ServiceQuotationFeatureEnabled(context) {
    return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/S4ServiceQuotation.global').getValue());
}
