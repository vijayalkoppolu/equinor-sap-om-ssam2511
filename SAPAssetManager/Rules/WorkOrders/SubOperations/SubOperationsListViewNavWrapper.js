
import TelemetryLibrary from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function SubOperationsListViewNavWrapper(context) {
    return TelemetryLibrary.executeActionWithLogPageEvent(context,
        '/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationsListViewNav.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMWorkOrder.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_SUB_LIST);
}
