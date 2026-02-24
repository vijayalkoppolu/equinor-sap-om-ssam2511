import IsS4ServiceOrderFeatureEnabled from '../IsS4ServiceOrderFeatureEnabled';
import S4ServiceAuthorizationLibrary from '../../UserAuthorizations/S4ServiceAuthorizationLibrary';

export default function IsS4ServiceOrderCreateEnabled(context) {
    return IsS4ServiceOrderFeatureEnabled(context) && S4ServiceAuthorizationLibrary.isServiceOrderCreateEnabled(context);
}
