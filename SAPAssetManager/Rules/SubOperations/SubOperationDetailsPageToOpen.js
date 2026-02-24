import libPersona from '../Persona/PersonaLibrary';
import libTelemetry from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function SubOperationDetailsPageToOpen(context) {
    libTelemetry.logPageEvent(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMWorkOrder.global').getValue(), libTelemetry.PAGE_TYPE_SUB_DETAIL);
    return libPersona.isClassicHomeScreenEnabled(context) ? '/SAPAssetManager/Pages/WorkOrders/SubOperation/SubOperationDetailsClassic.page' :  '/SAPAssetManager/Pages/WorkOrders/SubOperation/SubOperationDetails.page';
}

export function SubOperationDetailsPageName(context) {
    return libPersona.isClassicHomeScreenEnabled(context) ? 'SubOperationDetailsClassicPage' :  'SubOperationDetailsPage';
}
