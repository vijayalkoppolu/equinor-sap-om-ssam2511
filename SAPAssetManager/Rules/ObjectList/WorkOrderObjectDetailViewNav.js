import libTelemetry from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function WorkOrderObjectDetailViewNav(context) {
    return libTelemetry.executeActionWithLogPageEvent(context,
        '/SAPAssetManager/Actions/ObjectList/WorkOrderObjectDetailViewNav.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/ObjectList.global').getValue(),
        libTelemetry.PAGE_TYPE_DETAIL);
}
