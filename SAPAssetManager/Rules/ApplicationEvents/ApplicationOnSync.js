import isSyncInProgress from '../Sync/IsSyncInProgress';
import errorLibrary from '../Common/Library/ErrorLibrary';
import NetworkLib from '../Common/Library/NetworkMonitoringLibrary';
import IsESRINameUserAuthEnabled from '../ESRI/IsESRINameUserAuthEnabled';
import EsriLibrary from '../ESRI/EsriLibrary';
import telemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import SetSyncInProgressState from '../Sync/SetSyncInProgressState';

export default function ApplicationOnSync(clientAPI) {

    // TODO: remove the workaround when MDK provides a solution (MDKBUG-1604)
    let pageProxy = clientAPI.getPageProxy();
    if (pageProxy && pageProxy.getGlobalSideDrawerControlProxy) {
        let sideDrawer = pageProxy.getGlobalSideDrawerControlProxy();
        if (sideDrawer) {
            // prevents a navigation history from being reset on the next navigation
            sideDrawer._control.blankItemSelected = false;
        }
    }
                    
    if (!isSyncInProgress(clientAPI)) {
        if (!NetworkLib.isNetworkConnected(pageProxy)) {
            clientAPI.getClientData().Error = clientAPI.localizeText('network_error');
            clientAPI.getPageProxy().getGlobalSideDrawerControlProxy().redraw();
            pageProxy.executeAction('/SAPAssetManager/Actions/SyncError/SyncErrorNoConnection.action');
            return false;
        }
        errorLibrary.clearError(clientAPI);
        SetSyncInProgressState(clientAPI, true);
        telemetryLibrary.logSystemEvent(clientAPI,
            clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/Sync.global').getValue(),
            telemetryLibrary.EVENT_TYPE_START,
            'Manual', // custom sub-type for manual sync
        );
        //check if token expired for the ESRI Named User Authentication
        if (IsESRINameUserAuthEnabled(clientAPI)) {
            return EsriLibrary.callESRIAuthenticate(clientAPI, '/SAPAssetManager/Actions/SyncInitializeProgressBannerMessage.action', false, true);
        }
        return clientAPI.executeAction('/SAPAssetManager/Actions/SyncInitializeProgressBannerMessage.action');
    } else {
        return clientAPI.executeAction('/SAPAssetManager/Actions/SyncInProgress.action');
    }
}
