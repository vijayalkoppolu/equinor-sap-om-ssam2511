import libCommon from '../../Common/Library/CommonLibrary';
import libTelemetry from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import PreloadHierarchyListPickerValues from '../../HierarchyControl/PreloadHierarchyListPickerValues';

export default function FunctionalLocationCreateNav(context) {
    //Set the global TransactionType variable to CREATE
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(context, true);
    libCommon.resetChangeSetActionCounter(context);
    
    context.getPageProxy().setActionBinding({});
  
    PreloadHierarchyListPickerValues(context, '/SAPAssetManager/Pages/FunctionalLocation/FunctionalLocationCreateUpdate.page');
    return libTelemetry.executeActionWithLogUserEvent(context,
        '/SAPAssetManager/Actions/FunctionalLocation/CreateUpdate/FunctionalLocationCreateChangeset.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/CreateTechObjects.global').getValue(),
        libTelemetry.EVENT_TYPE_CREATE);
}
