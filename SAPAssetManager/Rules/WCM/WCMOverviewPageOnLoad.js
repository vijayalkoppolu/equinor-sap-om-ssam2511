
import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';

export default function WCMOverviewPageOnLoad(clientAPI) {
    // Log the telemetry event
    TelemetryLibrary.logPageEvent(clientAPI,
        clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/Home.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_OVERVIEW, PersonaLibrary.getActivePersonaCode(clientAPI));
}
