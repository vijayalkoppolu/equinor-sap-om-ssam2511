
import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function EquipmentDetailsPageToOpen(context) {
    TelemetryLibrary.logPageEvent(context,
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/CATechObj.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_EQUIP_DETAIL); 
    return '/SAPAssetManager/Pages/Equipment/EquipmentDetails.page';
}
