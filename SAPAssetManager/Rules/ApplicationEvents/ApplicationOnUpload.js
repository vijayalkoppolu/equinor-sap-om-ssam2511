
export default function ApplicationOnUpload(clientAPI) {
    const unsent = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Personalization/DeltaSync/RequestQueueUnsent.global').getValue();
    const failed = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Personalization/DeltaSync/RequestQueueFailed.global').getValue();
    return clientAPI.count('/SAPAssetManager/Services/AssetManager.service', 'RequestQueue', `$filter=(Status eq '${unsent}' or Status eq '${failed}')`).then(function(pendingEntitiescount) {
        if (pendingEntitiescount > 0) {
            return clientAPI.executeAction('/SAPAssetManager/Actions/UploadDataProgressBannerMessage.action');
        }
        return clientAPI.executeAction('/SAPAssetManager/Actions/NoDataToUploadMessage.action');
    });
}
