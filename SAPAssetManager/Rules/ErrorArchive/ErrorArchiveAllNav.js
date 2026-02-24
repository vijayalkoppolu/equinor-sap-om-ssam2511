
import libTelemetry from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function ErrorArchiveAllNav(context) {
    context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SlideOutMenu = true;
    return libTelemetry.executeActionWithLogPageEvent(context,
        '/SAPAssetManager/Actions/ErrorArchive/ErrorsArchive.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Error.global').getValue(),
        libTelemetry.PAGE_TYPE_LIST);
}
