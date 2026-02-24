import Logger from '../Log/Logger';
import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';
import ODataLibrary from '../OData/ODataLibrary';

export default function ReadingOnlineUserFeatures(context) {
    ///Read features enable for the user from UserFeatures online entity set
    return ODataLibrary.initializeOnlineService(context).then(function() {
        return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'UserFeatures', [], '').then(function(features) {
            if (features.length > 0) {
                UserFeaturesLibrary.setUserFeatures(context,features);
            } else {
                Logger.error('UserFeatures','No user features enabled on the backend');
            }
        }).catch((err) => {
            Logger.error('UserFeatures','Reading UserFeatures from online service failed');
            UserFeaturesLibrary.removeSavedUserFeatures(context);
            context.getClientData().Error=err?.message || err?.toString() || context.localizeText('reading_user_features_failed');
            throw err;
        });
    }).catch((err) => {
        Logger.error('UserFeatures','Connecting to online service failed');
        UserFeaturesLibrary.removeSavedUserFeatures(context);
        context.getClientData().Error=err?.message || err?.toString() || context.localizeText('online_service_unknown_error');
        throw err;
    });
}
