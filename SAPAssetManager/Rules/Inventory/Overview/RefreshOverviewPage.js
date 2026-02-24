import RefreshSoftInputModeConfig from '../Common/RefreshSoftInputModeConfig';
import TelemetryLibrary from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';

export default function RefreshOverviewPage(clientAPI) {
    RefreshSoftInputModeConfig(clientAPI);
    // Log the telemetry event
    TelemetryLibrary.logPageEvent(clientAPI,
        clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/Home.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_OVERVIEW, PersonaLibrary.getActivePersonaCode(clientAPI));
    clientAPI.getControls()[0].redraw();
}
