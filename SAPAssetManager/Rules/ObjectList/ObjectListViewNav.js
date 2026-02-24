import libTelemetry from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function ObjectListViewNav(context) {
    return libTelemetry.executeActionWithLogPageEvent(context,
        '/SAPAssetManager/Actions/ObjectList/ObjectListViewNav.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/ObjectList.global').getValue(),
        libTelemetry.PAGE_TYPE_LIST);
}
