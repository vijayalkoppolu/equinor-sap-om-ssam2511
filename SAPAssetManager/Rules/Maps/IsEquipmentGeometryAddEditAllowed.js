import CommonLibrary from '../Common/Library/CommonLibrary';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function IsEquipmentGeometryAddEditAllowed(context) {
    return userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GISAddEdit.global').getValue()) 
    && 
    CommonLibrary.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.EQ.Edit') === 'Y';
}
