import ApplicationSettings from '../Common/Library/ApplicationSettings';
import InitializeOnUserSwitch from './InitializeOnUserSwitch';
import IsESRINameUserAuthEnabled from '../ESRI/IsESRINameUserAuthEnabled';
import EsriLibrary from '../ESRI/EsriLibrary';
import LoadPersonaOverview from '../Persona/LoadPersonaOverview';
import CheckForSyncErrorsAfterDownloadSuccess from '../Sync/CheckForSyncErrorsAfterDownloadSuccess';
import RemoveHeader from './RemoveHeader';
import Logger from '../Log/Logger';
import SetUpDefaultHomeScreen from '../UserPreferences/SetUpDefaultHomeScreen';

/**
* Function that executes when reset action is being called with Skip Reset set to true
* @param {IClientAPI} context
*/
export default async function ApplicationOnUserSwitch(context) {
    ApplicationSettings.setBoolean(context, 'didUserSwitchDeltaCompleted', false);
    //In case there is a network disconnect, and the user tries to perform an app-update. We want to make sure app-update knows this is not an initial sync.
    ApplicationSettings.setBoolean(context, 'initialSync', false);
    context.getGlobalSideDrawerControlProxy().setSelectedMenuItemByName('OverviewBlank');
    context.showActivityIndicator(context.localizeText('download_progress'));

    try {
        await context.executeAction('/SAPAssetManager/Actions/OData/ReInitializeOfflineOData.action');
        setCustomHeadersForUserSwitch(context);
        if (IsESRINameUserAuthEnabled(context)) {
            await EsriLibrary.callESRIAuthenticate(context,'', true, true);
            context.showActivityIndicator(context.localizeText('download_progress'));
        }

        await InitializeOnUserSwitch(context);
        ApplicationSettings.setBoolean(context, 'didUserSwitchDeltaCompleted', true);
        RemoveHeader(context, 'UserSwitch');
        await LoadPersonaOverview(context);
        await SetUpDefaultHomeScreen(context);
        await CheckForSyncErrorsAfterDownloadSuccess(context);
        ApplicationSettings.remove(context, 'didUserSwitchDeltaCompleted');
        //All the app parameters are reset above. The default value for initialSync is true. We want to make sure initialSync = false after user switch.
        ApplicationSettings.setBoolean(context, 'initialSync', false);
        ApplicationSettings.remove(context, 'LastSyncTimestampFromBackend');
    } catch (error) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryUserSwitch.global').getValue(), `ApplicationOnUserSwitch(context) error: ${error}`);
    } finally {
        context.dismissActivityIndicator();
    }
}

function setCustomHeadersForUserSwitch(context) {
    try {
        const provider = context.getODataProvider('/SAPAssetManager/Services/AssetManager.service');
        const storeParameters = provider.getOfflineParameters();
        let headers = storeParameters.getCustomHeaders() || {};
        headers.UserSwitch = true;
        storeParameters.setCustomHeaders(headers);
    } catch (error) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryUserSwitch.global').getValue(), `setCustomHeadersForUserSwitch(context) error: ${error}`);
        throw error;
    }
}
