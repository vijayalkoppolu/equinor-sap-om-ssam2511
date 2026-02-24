import InitDefaultOverviewRows from '../Confirmations/Init/InitDefaultOverviewRows';
import RefreshMetadata from '../LCNC/RefreshMetadata';
import setSyncInProgressState from './SetSyncInProgressState';
import telemetryLib from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default async function CheckForSyncErrorsAfterDownloadFailure(context) {
    telemetryLib.logSystemEventWithDeltaSyncEnd(context, 'fail');
    setSyncInProgressState(context, false);
    await RefreshMetadata(context);
    await InitDefaultOverviewRows(context);

    let result = await context.count('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', '');
    let action = result > 0 ? '/SAPAssetManager/Actions/OData/ODataUploadFailureMessage.action' : '/SAPAssetManager/Actions/OData/ODataDownloadFailureMessage.action';
    return context.executeAction(action);
}
