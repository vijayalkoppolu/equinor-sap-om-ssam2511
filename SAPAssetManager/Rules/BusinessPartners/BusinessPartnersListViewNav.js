
import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function BusinessPartnersListViewNav(context) {
    return TelemetryLibrary.executeActionWithLogPageEvent(context,
        '/SAPAssetManager/Actions/BusinessPartners/BusinessPartnersListViewNav.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/BusinessPartner.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_LIST);
}
