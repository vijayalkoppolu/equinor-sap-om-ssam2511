import TelemetryLibrary from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function StockListViewNav(context) {
    return TelemetryLibrary.executeActionWithLogPageEvent(context,
        '/SAPAssetManager/Actions/Inventory/Stock/StockListViewNav.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/VehicleStock.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_LIST);
}
