import libCom from '../../Rules/Common/Library/CommonLibrary';
import ApplicationSettings from '../Common/Library/ApplicationSettings';
import Logger from '../Log/Logger';
import SetSyncInProgressState from './SetSyncInProgressState';

export default function getLastSyncTimestamp(context) {
    let userGUID = libCom.getUserGuid(context);
    return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'LastSyncDetails', [], `$filter=UserGuid eq '${userGUID}'`).then(function(userResult) {
        if (userResult && userResult.getItem(0)) {
            let timeStamp = userResult.getItem(0).LastSyncTimeStampFromBackend;
            ApplicationSettings.setString(context, 'LastSyncTimestampFromBackend', timeStamp);
        }
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySync.global').getValue(), `LastSyncDetails error: ${error}`);
        SetSyncInProgressState(context, false);
    });
}
