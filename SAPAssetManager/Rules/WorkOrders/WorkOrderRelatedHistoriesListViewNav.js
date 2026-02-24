
import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function WorkOrderRelatedHistoriesListViewNav(context) {
    return TelemetryLibrary.executeActionWithLogPageEvent(context,
        '/SAPAssetManager/Actions/WorkOrders/WorkOrderRelatedHistoriesListViewNav.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/WorkOrderHistories.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_LIST);
}
