import Logger from '../Log/Logger';
import ODataLibrary from '../OData/ODataLibrary';
import appSettings from '../Common/Library/ApplicationSettings';
import personaLibrary from './PersonaLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default async function GetUserPersonasOnline(context) {
    try {
        const initSuccess = await ODataLibrary.initializeOnlineService(context);
        if (initSuccess) {
            const userPersonasResults = await context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'UserPersonas', [], '');
            personaLibrary.initializePersona(context, userPersonasResults);
            const userSyncGroupResults = await context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'UserSyncGroupDetails', [], '');
            if (userSyncGroupResults?.length > 0) {
                appSettings.remove(context, 'SyncGroupCount');
                appSettings.setNumber(context, 'SyncGroupCount', userSyncGroupResults.length);
                for (let index = 0; index < userSyncGroupResults.length; index++) {
                    appSettings.remove(context, 'SyncGroup-'+index);
                    appSettings.setString(context, 'SyncGroup-'+index, userSyncGroupResults.getItem(index).EntitySetName);
                }
                Logger.info(`results: ${userSyncGroupResults.length}`);
            }
            const userSystemInfos = await context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'UserSystemInfos', [], '');
            if (userSystemInfos?.length > 0) {
                appSettings.remove(context, 'UserSystemInfos');
                appSettings.setString(context, 'UserSystemInfos', JSON.stringify(userSystemInfos));
            }
            return true;
        } else {
            Logger.error('Online service did not initialize successfully');
            throw new Error(context.getClientData().Error || context.localizeText('online_service_not_initialized'));
        }
    } catch (err) {
        Logger.error(`Error while getting personas from the online service: ${err}`);
        context.getClientData().Error=err?.message || err?.toString() || context.localizeText('online_service_unknown_error');
        throw err;
    }
}
