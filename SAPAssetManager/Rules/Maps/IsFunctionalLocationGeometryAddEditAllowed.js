import CommonLibrary from '../Common/Library/CommonLibrary';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function IsFunctionalLocationGeometryAddEditAllowed(context) {
    return userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GISAddEdit.global').getValue()) 
    && 
    CommonLibrary.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.FL.Edit')  === 'Y';
}
