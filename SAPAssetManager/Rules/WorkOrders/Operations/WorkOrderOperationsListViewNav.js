import TelemetryLibrary from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function WorkOrderOperationsListViewNav(context) {
    return TelemetryLibrary.executeActionWithLogPageEvent(context,
        '/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMWorkOrder.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_ITEM_LIST);
}
