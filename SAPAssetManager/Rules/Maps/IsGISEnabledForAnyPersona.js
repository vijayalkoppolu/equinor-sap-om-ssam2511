import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function IsGISEnabledForAnyPersona(context) {
    return userFeaturesLib.isFeatureEnabledForAnyPersona(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GIS.global').getValue());
}
