import IsUploadOnlyPersonalized from '../UserPreferences/IsUploadOnlyPersonalized';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SyncLabel(clientAPI) {
    return IsUploadOnlyPersonalized(clientAPI) ? clientAPI.localizeText('upload') : clientAPI.localizeText('sync');
}
