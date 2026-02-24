import TelemetryLibrary from '../../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function AISamplesPageOnLoaded(context) {
    TelemetryLibrary.logPageEvent(context,
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/AIJobComplete.global').getValue(),
        TelemetryLibrary.EVENT_TYPE_HELP);    
}
