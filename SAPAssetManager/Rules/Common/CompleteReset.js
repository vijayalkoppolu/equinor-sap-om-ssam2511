import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import locationLib from '../LocationTracking/LocationTrackingLibrary';
import ApplicationSettings from './Library/ApplicationSettings';
import errorLib from './Library/ErrorLibrary';
import { getMapControlInOverViewPage } from '../UserPersonas/OverviewUserPersona';
import IsESRINameUserAuthEnabled from '../ESRI/IsESRINameUserAuthEnabled';
import EsriLibrary from '../ESRI/EsriLibrary';
import CommonLibrary from './Library/CommonLibrary';

export default async function CompleteReset(clientAPI, setInitialSync = true) {
    // Clear cache settings in map before reset
    const mapControl = await getMapControlInOverViewPage(clientAPI);
    if (CommonLibrary.isDefined(mapControl)) {
        const mapExtension = mapControl.getExtension();
        if (CommonLibrary.isDefined(mapExtension)) {
            mapExtension.clearUserDefaults();
        }
    }

    //Clear the esri named user authentication token
    if (userFeaturesLib.isFeatureEnabled(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/GIS.global').getValue()) && IsESRINameUserAuthEnabled(clientAPI)) {
        EsriLibrary.ClearESRIAccessFlags(clientAPI);
    }

    // Clear SDF token and set the flag to clear the cache on next load
    ApplicationSettings.remove(clientAPI, 'SDF_XSUAA_TOKEN');
    ApplicationSettings.setBoolean(clientAPI, 'SDFCacheFlush', true);

    // Changing the flag back to false to execute Update action again on subsequent reset
    userFeaturesLib.disableAllFeatureFlags(clientAPI);
    ApplicationSettings.setBoolean(clientAPI, 'didSetUserGeneralInfos', false);
    ApplicationSettings.setBoolean(clientAPI, 'initialSync', setInitialSync);
    //Reset the backend version and system client role that were cached
    ApplicationSettings.remove(clientAPI, 'BackendVersion');
    ApplicationSettings.remove(clientAPI, 'SystemClientRole');
    ApplicationSettings.remove(clientAPI, 'xappinfo');
    ApplicationSettings.remove(clientAPI, 'UserSystemInfos');

    // Reset Personalization configuration
    ApplicationSettings.remove(clientAPI, 'MeasuringPointView');
    ApplicationSettings.remove(clientAPI, 'InspectionCharacteristicView');

    // Reset the application launch flag
    ApplicationSettings.remove(clientAPI, 'applicationLaunch');

    // Disable service and rsset user switch for location tracking feature
    locationLib.disableService(clientAPI);
    locationLib.setUserSwitch(clientAPI, '');

    // Clear error messages
    errorLib.clearError(clientAPI);
    const stateVars = CommonLibrary.getGlobalStateVariables(clientAPI);
    ([...(Object.keys(stateVars) || [])])
        .filter(k => k.endsWith('_LayoutStylePreference'))
        .forEach(k => delete stateVars[k]);
    return Promise.resolve();
}
