import CommonLibrary from '../Common/Library/CommonLibrary';
import S4ServiceAuthorizationLibrary from '../UserAuthorizations/S4ServiceAuthorizationLibrary';

export default function IsEditDocumentEnabled(context, binding = context.binding) {
    let enabled = true;

    const entityName = binding?.['@odata.type'];
    switch (entityName) {
        case '#sap_mobile.S4ServiceOrderDocument':
            enabled = S4ServiceAuthorizationLibrary.isServiceOrderEditEnabled(context);
            break;
        case '#sap_mobile.S4ServiceRequestDocument':
            enabled = S4ServiceAuthorizationLibrary.isServiceRequestEditEnabled(context);
            break;
        case '#sap_mobile.S4ServiceQuotationDocument':
            enabled = S4ServiceAuthorizationLibrary.isServiceQuotationEditEnabled(context);
            break;
        case '#sap_mobile.S4ServiceConfirmationDocument':
            enabled = S4ServiceAuthorizationLibrary.isServiceConfirmationEditEnabled(context);
            break;
        default:
            break;
    }

    return enabled || CommonLibrary.isEntityLocal(binding);
}
