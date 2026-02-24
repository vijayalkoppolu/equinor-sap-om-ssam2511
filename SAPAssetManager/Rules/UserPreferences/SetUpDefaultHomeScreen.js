import libPersona from '../Persona/PersonaLibrary';
import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import PersonalizationPreferences from './PersonalizationPreferences';

/**
* Sets user preference to use new home screen layout as default after intial sync/app update
* @param {IClientAPI} clientAPI
*/
export default function SetUpDefaultHomeScreen(context) {
    return libPersona.setUpUserDefaultHomeScreen(context).then(() => {
        return PersonalizationPreferences.getLayoutStylePreference(context).then((layout) => {
            TelemetryLibrary.logSystemEvent(context, 
                context.getGlobalDefinition('/SAPAssetManager/Globals/Features/User.global').getValue(), 
                TelemetryLibrary.SYSTEM_TYPE_PREF_HOMELAYOUT,
                `${libPersona.getActivePersonaCode(context)}.${layout}`);
        });
    });
}
