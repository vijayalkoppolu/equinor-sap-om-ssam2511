import Logger from '../Log/Logger';
import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';
import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function ReadingOfflineUserFeatures(context) {
    // Read features enable for the user from UserFeatures entity set
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserFeatures', [], '').then(function(features) {
        if (features.length > 0) {
            // delete the previous flags
            UserFeaturesLibrary.disableAllFeatureFlags(context);
            // enable the new flags coming from the backend
            UserFeaturesLibrary.setUserFeatures(context, features);
            // log the enabled features to telemetry DB
            return TelemetryLibrary.logFeatureEvents(context, features);
        } else {
            UserFeaturesLibrary.disableAllFeatureFlags(context);
            Logger.error('UserFeatures ','No Features were enable on the backend');
            return Promise.resolve(); // no features enable is a valid case?
        }
    }).catch(() => {
        Logger.error('UserFeatures','Reading UserFeatures from offline service failed');
        return Promise.reject('Reading UserFeatures from offline service failed');
    });
}
