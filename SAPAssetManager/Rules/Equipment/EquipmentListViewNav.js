import Logger from '../Log/Logger';
import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function EquipmentListViewNav(context) {
    Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryEquipment.global').getValue(), 'EquipmentListViewNav called');
    return TelemetryLibrary.executeActionWithLogPageEvent(context,
        '/SAPAssetManager/Actions/Equipment/EquipmentListViewNav.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/CATechObj.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_EQUIP_LIST);
}
