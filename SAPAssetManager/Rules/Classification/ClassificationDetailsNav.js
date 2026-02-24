
import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function ClassificationDetailsNav(context) {
    return TelemetryLibrary.executeActionWithLogPageEvent(context,
        '/SAPAssetManager/Actions/Classification/ClassificationDetailsNav.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Classification.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_DETAIL);
}
