import TelemetryLibrary from '../../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function PRTListViewNav(context) {
    return TelemetryLibrary.executeActionWithLogPageEvent(context,
        '/SAPAssetManager/Actions/WorkOrders/Operations/PRT/PRTListViewNav.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PRT.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_LIST);
}
