import libCom from '../Common/Library/CommonLibrary';
import SDFIsFeatureEnabled from '../Forms/SDF/SDFIsFeatureEnabled';
import appSettings from '../Common/Library/ApplicationSettings';
import updateOnlineXSUAATokenEntity from '../Forms/SDF/updateOnlineXSUAATokenEntity';
import Logger from '../Log/Logger';

export default async function UploadData(clientAPI) {
    if (!libCom.isInitialSync(clientAPI)) {
        if (SDFIsFeatureEnabled(clientAPI)) {
            appSettings.setBoolean(clientAPI, 'SDFCacheFlush', true);
            const success = await updateOnlineXSUAATokenEntity(clientAPI, '');
            if (!success) {
                Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySync.global').getValue(), `Failure to update xsuaa token: ${success}`);
                clientAPI.getClientData().Error = clientAPI.localizeText('update_xsuaa_token', success);
                return clientAPI.executeAction('/SAPAssetManager/Actions/OData/ODataUploadFailureMessage.action');
            }
        }

        libCom.setStateVariable(clientAPI, 'UploadInProgress', true);
        return clientAPI.executeAction('/SAPAssetManager/Actions/OData/UploadOfflineData.action').then(async () => {
            let result = await clientAPI.count('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', '');
            let action = result > 0 ? '/SAPAssetManager/Actions/OData/ODataUploadFailureMessage.action' : '/SAPAssetManager/Actions/UploadSuccessMessage.action';
            return clientAPI.executeAction(action).then(() => {
                libCom.setStateVariable(clientAPI, 'UploadInProgress', false);
            });
        });
    }
}
