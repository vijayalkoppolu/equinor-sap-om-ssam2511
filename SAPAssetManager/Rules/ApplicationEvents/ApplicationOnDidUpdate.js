import Logger from '../Log/Logger';
import DownloadDefiningRequestWithAuthentication from '../OData/Download/DownloadDefiningRequestWithAuthentication';
import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function ApplicationOnDidUpdate(clientAPI) {
    Logger.init(clientAPI);
    return TelemetryLibrary.init(clientAPI).then(() => {
        return clientAPI.executeAction('/SAPAssetManager/Actions/Common/AppUpdateSuccess.action').then(() => {
            return DownloadDefiningRequestWithAuthentication(clientAPI).then(success => {
              return Promise.resolve(success);
            }).catch((failure) => {
                Logger.error('AppOnDidUpdateFailure', failure);
                return Promise.reject(clientAPI.localizeText('offline_odata_initialization_failed'));
            });
        });
    });
}
