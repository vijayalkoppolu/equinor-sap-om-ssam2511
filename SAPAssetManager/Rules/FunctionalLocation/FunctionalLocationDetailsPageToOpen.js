
import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function FunctionalLocationDetailsPageToOpen(context) {
    TelemetryLibrary.logPageEvent(context,
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/CATechObj.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_FLOC_DETAIL);
    return '/SAPAssetManager/Pages/FunctionalLocation/FunctionalLocationDetails.page';
}
