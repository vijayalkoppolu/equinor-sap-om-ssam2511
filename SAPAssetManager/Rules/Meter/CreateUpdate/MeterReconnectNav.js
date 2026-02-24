import libCommon from '../../Common/Library/CommonLibrary';
import libMeter from '../../Meter/Common/MeterLibrary';
import libTelemetry from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import MeterSectionLibrary from '../Common/MeterSectionLibrary';

export default function MeterRemoveUpdateNav(context) {
    const replaceBinding = MeterSectionLibrary.getMeterReplaceBinding(context);
    libMeter.setMeterTransactionType(context, 'RECONNECT');

    libTelemetry.logUserEvent(context,
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue(),
        libTelemetry.EVENT_TYPE_RECONNECT);

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(context, true);
    if (replaceBinding) {
        context.setActionBinding(replaceBinding);
        context.getClientData().MeterDetailsUpdateDisabled = true;
    }
    return context.executeAction('/SAPAssetManager/Actions/Meters/MeterDisconnectNav.action');
}
