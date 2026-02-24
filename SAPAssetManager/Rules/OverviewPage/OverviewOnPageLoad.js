import OnDateChanged from '../Common/OnDateChanged';
import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';

export default function OverviewOnPageLoad(context) {
    // First time the page has loaded, call OnDateChanged
    OnDateChanged(context);
    // Log the telemetry event
    TelemetryLibrary.logPageEvent(context,
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Home.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_OVERVIEW, PersonaLibrary.getActivePersonaCode(context));
}
