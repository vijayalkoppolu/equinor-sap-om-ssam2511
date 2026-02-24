import libCommon from '../../Common/Library/CommonLibrary';
import ODataLibrary from '../../OData/ODataLibrary';
import IsEditTechObjectFeatureEnabled from '../../UserFeatures/IsEditTechObjectFeatureEnabled';

export default function EquipmentOpenEditPage(context) {
    if (ODataLibrary.isLocal(context.binding) || IsEditTechObjectFeatureEnabled(context)) { //Allow local edits and tech object edit feature
        libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
        return context.executeAction('/SAPAssetManager/Actions/Equipment/CreateUpdate/EquipmentCreateUpdateNav.action');
    }

    return context.executeAction('/SAPAssetManager/Actions/Equipment/DocumentAddEditNav.action');
}
