import ESRIUserLogin from '../../ESRI/ESRIUserLogin';
import GetUserPersonas from '../../Persona/GetUserPersonas';
import ReadingOnlineUserFeatures from '../../UserFeatures/ReadingOnlineUserFeatures';
import LoadPersonaOverview from '../../Persona/LoadPersonaOverview';

export default function DownloadDefiningRequestWithAuthentication(context) {
    context.showActivityIndicator(context.localizeText('initializing_personas'));
    return GetUserPersonas(context).then(() => {
        context.dismissActivityIndicator();
        context.showActivityIndicator(context.localizeText('online_user_features'));
        return ReadingOnlineUserFeatures(context).then(() => {
            context.dismissActivityIndicator();
            context.showActivityIndicator(context.localizeText('loading_persona'));
            return LoadPersonaOverview(context).then(() => {
                context.dismissActivityIndicator();
                return ESRIUserLogin(context);
            });
        });
    }).catch(() => context.executeAction('/SAPAssetManager/Actions/OData/InitializeOfflineODataFailureMessage.action'));
}
