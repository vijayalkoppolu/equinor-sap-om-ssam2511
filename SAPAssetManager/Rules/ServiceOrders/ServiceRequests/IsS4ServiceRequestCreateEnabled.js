import S4ServiceAuthorizationLibrary from '../../UserAuthorizations/S4ServiceAuthorizationLibrary';
import IsS4ServiceRequestFeatureEnabled from './IsS4ServiceRequestFeatureEnabled';

export default function IsS4ServiceRequestCreateEnabled(context) {
    return IsS4ServiceRequestFeatureEnabled(context) && S4ServiceAuthorizationLibrary.isServiceRequestCreateEnabled(context);
}
