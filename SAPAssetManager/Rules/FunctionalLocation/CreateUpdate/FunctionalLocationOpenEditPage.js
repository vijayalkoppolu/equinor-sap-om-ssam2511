import libCommon from '../../Common/Library/CommonLibrary';
import IsEditTechObjectFeatureEnabled from '../../UserFeatures/IsEditTechObjectFeatureEnabled';
import ODataLibrary from '../../OData/ODataLibrary';

export default function FunctionalLocationUpdateNav(context) {
    if (ODataLibrary.isLocal(context.binding) || IsEditTechObjectFeatureEnabled(context)) {
        libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
        return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/CreateUpdate/FunctionalLocationCreateUpdateNav.action');
    }

    return context.executeAction('/SAPAssetManager/Actions/Equipment/DocumentAddEditNav.action');
}
