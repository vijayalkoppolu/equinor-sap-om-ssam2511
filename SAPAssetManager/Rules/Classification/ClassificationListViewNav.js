
import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function ClassificationListViewNav(context) {
    return TelemetryLibrary.executeActionWithLogPageEvent(context,
        '/SAPAssetManager/Actions/Classification/ClassificationListViewNav.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Classification.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_LIST);
}
