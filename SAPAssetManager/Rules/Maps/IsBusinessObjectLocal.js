import ODataLibrary from '../OData/ODataLibrary';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function IsBusinessObjectLocal(context) {
    return  ODataLibrary.isLocal(context.binding) && userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GISAddEdit.global').getValue()) ;
}
