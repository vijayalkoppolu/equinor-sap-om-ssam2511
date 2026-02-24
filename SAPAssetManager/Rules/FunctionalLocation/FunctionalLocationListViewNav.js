import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function FunctionalLocationListViewNav(context) {
    return TelemetryLibrary.executeActionWithLogPageEvent(context,
        '/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationsListViewNav.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/CATechObj.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_FLOC_LIST);
}
