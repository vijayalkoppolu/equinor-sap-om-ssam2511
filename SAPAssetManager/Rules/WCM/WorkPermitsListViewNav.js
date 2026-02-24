
import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function WorkPermitsListViewNav(context, actionData) {
    return TelemetryLibrary.executeActionWithLogPageEvent(context,
        actionData || '/SAPAssetManager/Actions/WCM/WorkPermitsListViewNav.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/WCMWorkPermit.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_LIST);
}
