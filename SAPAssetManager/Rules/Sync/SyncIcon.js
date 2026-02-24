/**
* Get Sync State
* @param {IClientAPI} context
*/
import IsAutoSyncInProgress from './IsAutoSyncInProgress';
import IsUploadOnlyPersonalized from '../UserPreferences/IsUploadOnlyPersonalized';

export default function SyncIcon(context) {
    
    return IsAutoSyncInProgress(context) ?
        '$(PLT, /SAPAssetManager/Images/auto-sync.pdf, /SAPAssetManager/Images/auto-sync.android.png, null, /SAPAssetManager/Images/auto-sync.windows.png)' : IsUploadOnlyPersonalized(context) ?
        '$(PLT, sap-icon://upload, sap-icon://upload, null, sap-icon://upload' :
        '$(PLT, sap-icon://synchronize, sap-icon://synchronize, null, sap-icon://synchronize)';
}
