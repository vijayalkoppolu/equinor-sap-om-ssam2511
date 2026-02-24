/**
* Initialize action on User Switch
* @param {IClientAPI} context
*/
import ApplicationSettings from '../Common/Library/ApplicationSettings';
import Logger from '../Log/Logger';
import setSyncInProgressState from '../Sync/SetSyncInProgressState';
import ReadingOfflineUserFeatures from '../UserFeatures/ReadingOfflineUserFeatures';
import InitilzePersonasOffline from '../Common/InitilzePersonasOffline';
import InitializeGlobalStates from '../Common/InitializeGlobalStates';
import libTelemetry from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import InitializeCachedStaticVariables from '../Common/InitializeCachedStaticVariables';

export default async function InitializeOnUserSwitch(context) {
    libTelemetry.logSystemEventWithDeltaSyncStart(context);
    try {
        await context.executeAction({
            'Name': '/SAPAssetManager/Actions/OData/UploadOfflineData.action',
            'Properties': {
                'OnSuccess': '',
            },
        });
        await context.executeAction({
            'Name': '/SAPAssetManager/Actions/Documents/DownloadOfflineOData.action',
            'Properties': {
                'OnSuccess': '',
            },
        });
        await InitilzePersonasOffline(context);
        await ReadingOfflineUserFeatures(context);
        await InitializeCachedStaticVariables(context);
        await InitializeGlobalStates(context);
    } catch (error) {
        handleInitializationError(context, error);
        throw error;
    } finally {
        libTelemetry.logUserEvent(context,
            context.getGlobalDefinition('/SAPAssetManager/Globals/Features/User.global').getValue(),
            libTelemetry.EVENT_TYPE_SWITCH);
    }
}

function handleInitializationError(context, error) {
    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryUserSwitch.global').getValue(),`InitializeOnUserSwitch(context) error: ${error}`);
    // set to false to initialize ApplicationOnUserSwitch again in the DownloadActionsOrRulesSequence
    // to resend parameters and requests to the backend to get the data from the second user
    ApplicationSettings.setBoolean(context, 'didUserSwitchDeltaCompleted', false);
    // reset persona to show limited options on the side menu
    ApplicationSettings.setString(context, 'ActivePersona', '');
    // set to false to initialize sync in the ApplicationOnSync rule after user press sync button
    setSyncInProgressState(context, false);
}
