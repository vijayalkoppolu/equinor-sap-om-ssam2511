import S4ErrorsLibrary from '../../S4Errors/S4ErrorsLibrary';
import IsS4ServiceOrderFeatureDisabled from '../../ServiceOrders/IsS4ServiceOrderFeatureDisabled';
import S4ServiceAuthorizationLibrary from '../../UserAuthorizations/S4ServiceAuthorizationLibrary';
import IsServiceOrderReleased from '../../ServiceOrders/Status/IsServiceOrderReleased';
import IsS4ServiceConfirmationEnabled from '../IsS4ServiceConfirmationEnabled';

export default function IsServiceConfirmationCreateEnabled(context) {
    if (IsS4ServiceOrderFeatureDisabled(context) 
        || IsS4ServiceConfirmationEnabled(context)
        || !S4ServiceAuthorizationLibrary.isServiceConfirmationCreateEnabled(context)) return false;

    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        if (S4ErrorsLibrary.isS4ObjectHasErrorsInBinding(context)) return false;

        return IsServiceOrderReleased(context).then(isReleased => {
            return isReleased; 
        }).catch(function() {
            return true;
        });
    }

    return true;
}
