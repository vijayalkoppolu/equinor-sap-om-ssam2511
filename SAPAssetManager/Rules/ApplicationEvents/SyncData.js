import DeleteUnusedOverviewEntities from '../Confirmations/Init/DeleteUnusedOverviewEntities';
import setSyncInProgressState from '../Sync/SetSyncInProgressState';
import errorLibrary from '../Common/Library/ErrorLibrary';
import libCom from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import appSettings from '../Common/Library/ApplicationSettings';
import SDFIsFeatureEnabled from '../Forms/SDF/SDFIsFeatureEnabled';
import updateOnlineXSUAATokenEntity from '../Forms/SDF/updateOnlineXSUAATokenEntity';
import ODataLibrary from '../OData/ODataLibrary';
import libTelemetry from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import ApplicationOnUserSwitch from './ApplicationOnUserSwitch';
import getLastSyncTimestamp from '../Sync/GetLastSyncTimestamp';
import ApplicationSettings from '../Common/Library/ApplicationSettings';
import { WHO_TASK_CONFIRM } from '../EWM/WarehouseTask/HandlingUnit/OnSuccessWarehouseTaskConfirmationCSCreateUpdate';
import { WarehouseOrdersTasksDefiningRequestsList } from '../EWM/Common/EWMLibrary';


export default async function SyncData(clientAPI) {
    clientAPI.getClientData().Error = '';

    const pageProxy = clientAPI.getPageProxy();
    const autoSyncProfile = pageProxy.getClientData().autoSyncProfile;

    if (autoSyncProfile) {
        delete pageProxy.getClientData().autoSyncProfile;
    }

    /**
     * If the switch user sync errors out and the user presses the sync button either on the error detail screen 
     * or from the landing page, we want to start the switch user sync again and not do a regular delta sync here.
     * This needs to be checked first and should be kept at the top of this function.
     */
    const userSwitchDeltaCompleted = appSettings.getBoolean(clientAPI, 'didUserSwitchDeltaCompleted', true);
    if (userSwitchDeltaCompleted === false) {
        return ApplicationOnUserSwitch(clientAPI);
    }

    setSyncInProgressState(clientAPI, true);
    libCom.removeStateVariable(clientAPI, 'isAnyWorkOrderStarted');

    if (SDFIsFeatureEnabled(clientAPI)) {
        appSettings.setBoolean(clientAPI, 'SDFCacheFlush', true);
        const success = await updateOnlineXSUAATokenEntity(clientAPI, '');
        if (!success) {
            Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySync.global').getValue(), `Failure to update xsuaa token: ${success}`);

            setSyncInProgressState(clientAPI, false);
            return false;
        }
    }

    if (!libCom.isInitialSync(clientAPI)) {
        errorLibrary.clearError(clientAPI);
        appSettings.remove(clientAPI, 'LocallyIntalledEquip');
        return clientAPI.executeAction('/SAPAssetManager/Actions/OData/ReInitializeOfflineOData.action').then(() => {
            libTelemetry.logSystemEventWithDeltaSyncStart(clientAPI);

            const {
                uploadCategories,
                definingRequests,
            } = specifySyncParams(clientAPI, autoSyncProfile);

            const properties = {};

            if (uploadCategories?.length) {
                properties.UploadCategories = uploadCategories;
            }

            return clientAPI.executeAction({
                Name: '/SAPAssetManager/Actions/OData/UploadOfflineData.action',
                Properties: properties,
            }).then(() => {
                if (definingRequests?.length) {
                    return DeleteUnusedOverviewEntities(clientAPI)
                        .then(() => downloadDefiningRequests(clientAPI, definingRequests));
                }

                return ODataLibrary.initializeOnlineService(clientAPI).then(function() {
                    const deltaSyncConst = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/DeltaSync/DeltaSync.global').getValue();
                    const DownloadEffectedEntitiesConst = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/DeltaSync/DownloadEffectedEntities.global').getValue();
                    let param = libCom.getAppParam(clientAPI, deltaSyncConst, DownloadEffectedEntitiesConst);
                    let modifiedEntitiesDefiningRequests = [];
                    if (!libVal.evalIsEmpty(param) && param === 'Y') {
                        let timeStamp = ApplicationSettings.getString(clientAPI, 'LastSyncTimestampFromBackend');
                        let filter = !libVal.evalIsEmpty(timeStamp) ? `$filter=LastSyncTimestampFromDevice eq datetime'${timeStamp}'` : '';
                        return clientAPI.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'ModifiedEntities', [], filter).then(function(ModifiedEntityResults) {
                            if (ModifiedEntityResults && ModifiedEntityResults.length > 0) {
                                for (let index = 0; index < ModifiedEntityResults.length; index++) {
                                    let entitysetName = ModifiedEntityResults.getItem(index).EntityName;
                                    modifiedEntitiesDefiningRequests.push({
                                        'Name': entitysetName,
                                        'Query': entitysetName,
                                    });
                                }
                                return DeleteUnusedOverviewEntities(clientAPI)
                                    .then(() => downloadDefiningRequests(clientAPI, modifiedEntitiesDefiningRequests));
                            }
                            getLastSyncTimestamp(clientAPI);
                            setSyncInProgressState(clientAPI, false);
                            return clientAPI.executeAction('/SAPAssetManager/Actions/SyncSuccessMessage.action');
                        }).catch((error) => {
                            Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySync.global').getValue(), `ModifiedEntities error: ${error}`);
                            setSyncInProgressState(clientAPI, false);
                        });
                    }
                    return clientAPI.executeAction('/SAPAssetManager/Actions/Documents/DownloadOfflineOData.action');
                }).catch((error) => {
                    Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySync.global').getValue(), `initializeOnlineService error: ${error}`);
                    setSyncInProgressState(clientAPI, false);
                });
            }).catch((error) => {
                Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySync.global').getValue(), `UploadOfflineData error: ${error}`);
                setSyncInProgressState(clientAPI, false);
            });
        }).catch((error) => {
            Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySync.global').getValue(), `ReInitializeOfflineOData error: ${error}`);
            setSyncInProgressState(clientAPI, false);
        });
    }
    //This is an initial sync
    return clientAPI.getDefinitionValue('/SAPAssetManager/Rules/OData/Download/DownloadDefiningRequestWithAuthentication.js').then(() => {
        setSyncInProgressState(clientAPI, false);
    });
}

function downloadDefiningRequests(clientAPI, definingRequests) {
    return clientAPI.executeAction({
        'Name': '/SAPAssetManager/Actions/Documents/DownloadOfflineOData.action',
        'Properties': {
            'DefiningRequests': definingRequests,
        },
    }).catch((error) => {
        Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySync.global').getValue(), `DownloadOfflineOData error: ${error}`);
        setSyncInProgressState(clientAPI, false);
    });
}

function specifySyncParams(clientAPI, autoSyncProfile) {
    const params = {
        uploadCategories: [],
        definingRequests: [],
    };

    if (autoSyncProfile === WHO_TASK_CONFIRM) {
        params.uploadCategories = [clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/EWM/TaskConfirmationUploadCategory.global').getValue()];

        // If we are in lite mode, we only download WarehouseOrders and Tasks related entites
        if (libCom.getAppParam(clientAPI, 'EWM', 'download.lite') === 'Y') {
            params.definingRequests = WarehouseOrdersTasksDefiningRequestsList;
        }
    }

    return params;
}
