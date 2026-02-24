import CommonLibrary from '../Common/Library/CommonLibrary';
import S4ServiceAuthorizationLibrary from '../UserAuthorizations/S4ServiceAuthorizationLibrary';
import IsS4ServiceQuotationFeatureEnabled from './IsS4ServiceQuotationFeatureEnabled';

export default function IsS4ServiceQuotationEditEnabled(context) {
    return IsS4ServiceQuotationFeatureEnabled(context) && (S4ServiceAuthorizationLibrary.isServiceQuotationEditEnabled(context) || CommonLibrary.isEntityLocal(context.binding));
}
