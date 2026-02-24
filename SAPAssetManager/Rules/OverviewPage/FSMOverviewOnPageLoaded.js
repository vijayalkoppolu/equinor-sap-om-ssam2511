import FSMOverviewHelpers from './Helpers/FSMOverviewHelpers';
import libAnalytics from '../Extensions/EventLoggers/Analytics/AnalyticsLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';

/**
* Need to generate missing overview rows on screen open
* @param {IClientAPI} context
*/
export default function FSMOverviewOnPageLoaded(context) {
    const selectedDefaultVal = FSMOverviewHelpers.defaultPeriodValue(context);
    const bounds = FSMOverviewHelpers.getBoundsFromSelectedValue(context, selectedDefaultVal);
    // Log the telemetry event
    TelemetryLibrary.logPageEvent(context,
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Home.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_OVERVIEW, PersonaLibrary.getActivePersonaCode(context));

    return FSMOverviewHelpers.updateDateRangeVariable(context, bounds, selectedDefaultVal).then(() => {
        if (libCommon.isApplicationLaunch(context)) {
            libAnalytics.fieldServiceTechnicaionAppLaunch();
        }
    });
}
