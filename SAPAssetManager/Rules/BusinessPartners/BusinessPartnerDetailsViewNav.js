import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function BusinessPartnerDetailsViewNav(context) {
    return TelemetryLibrary.executeActionWithLogPageEvent(context,
        '/SAPAssetManager/Actions/BusinessPartners/BusinessPartnerDetailsViewNav.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/BusinessPartner.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_DETAIL);
}
