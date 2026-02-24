import TelemetryLibrary from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function InspectionLotSetUsage(context) {
    TelemetryLibrary.executeActionWithLogUserEvent(context,
        '/SAPAssetManager/Actions/WorkOrders/InspectionLot/InspectionLotSetUsage.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue(),
        TelemetryLibrary.EVENT_TYPE_COMPLETE);
}
