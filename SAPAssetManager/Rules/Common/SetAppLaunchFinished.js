import ApplicationSettings from './Library/ApplicationSettings';
import libAnalytics from '../Extensions/EventLoggers/Analytics/AnalyticsLibrary';
import libPersona from '../Persona/PersonaLibrary';
import libTelemetry from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default async function SetAppLaunchFinished(context) {
    ApplicationSettings.setBoolean(context, 'onAppLaunch', false);

    return triggerTelemetryEvents(context).then(() => {
        return libAnalytics.init(context).then((result) => {
            if (result) {
                triggerAnalyticsEvents(context);
            }
        });
    });
}

function triggerAnalyticsEvents(context) {
    libAnalytics.systemLaunch();
    libAnalytics.appLaunch();

    let personaObject = {
        MT: libAnalytics.maintenanceTechnicaionAppLaunch,
        MTSTD: libAnalytics.maintenanceTechnicaionSTDAppLaunch,
        FSTPR: libAnalytics.fieldServiceTechnicaionProAppLaunch,
        FST: libAnalytics.fieldServiceTechnicaionAppLaunch,
        IC: libAnalytics.inventoryManagerAppLaunch,
        ST: libAnalytics.safetyTechnicaionAppLaunch,
    };

    let personaCode = libPersona.getActivePersonaCode(context);

    for (const persona in personaObject) {
        if (persona === personaCode) {
            personaObject[persona]();
        }
    }
}

function triggerTelemetryEvents(context) {

    libTelemetry.logUserEventWithLaunchMode(context);

    return context.read('/SAPAssetManager/Services/AssetManager.service',
        'AppParameters', [], "$filter=ParamGroup eq 'ASSIGNMENTTYPE'").then((params) => {
        if (params?.length > 0) {
            const featureMap = new Map([
                ['WorkOrder', '/SAPAssetManager/Globals/Features/PMWorkOrder.global'],
                ['ServiceOrder', '/SAPAssetManager/Globals/Features/CSServiceOrder.global'],
                ['S4ServiceOrder', '/SAPAssetManager/Globals/Features/CSServiceOrder.global'],
            ]);
            for (let i = 0; i < params.length; i++) {
                for (const [key, value] of featureMap) {
                    if (params.getItem(i).ParameterName === key) {
                        if (params.getItem(i).ParamValue.length > 0) {
                            libTelemetry.logSystemEvent(context,
                                context.getGlobalDefinition(value).getValue(),
                                libTelemetry.SYSTEM_TYPE_ASSIGN_TYPE,
                                params.getItem(i).ParamValue);
                        }
                        // Remove the feature from the map to avoid duplicate logging
                        featureMap.delete(key);
                    }
                }
            }
        }
        return Promise.resolve();
    });
}
