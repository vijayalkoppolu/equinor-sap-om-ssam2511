import IsUploadOnlyPersonalized from '../UserPreferences/IsUploadOnlyPersonalized';
import ApplicationOnSync from './ApplicationOnSync';
import ApplicationOnUpload from './ApplicationOnUpload';

export default function ApplicationOnSyncWrapper(clientAPI) {
    if (IsUploadOnlyPersonalized(clientAPI)) {
        return ApplicationOnUpload(clientAPI);
    }
    return ApplicationOnSync(clientAPI);
}
