import S4ServiceAuthorizationLibrary from '../UserAuthorizations/S4ServiceAuthorizationLibrary';
import IsS4ServiceQuotationFeatureEnabled from './IsS4ServiceQuotationFeatureEnabled';

export default function IsS4ServiceQuotationCreateEnabled(context) {
    return IsS4ServiceQuotationFeatureEnabled(context) && S4ServiceAuthorizationLibrary.isServiceQuotationCreateEnabled(context);
}
