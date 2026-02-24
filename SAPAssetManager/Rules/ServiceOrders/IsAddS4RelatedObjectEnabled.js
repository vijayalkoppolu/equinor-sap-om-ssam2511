import S4ServiceAuthorizationLibrary from '../UserAuthorizations/S4ServiceAuthorizationLibrary';
import EnableWorkOrderCreate from '../UserAuthorizations/WorkOrders/EnableWorkOrderCreate';

export default function IsAddS4RelatedObjectEnabled(context, binding = context.binding) {
    let enabled = true;

    const entityName = binding?.['@odata.type'];
    switch (entityName) {
        case '#sap_mobile.S4ServiceOrderPartner':
        case '#sap_mobile.S4ServiceOrder':
        case '#sap_mobile.S4ServiceItem':
            enabled = S4ServiceAuthorizationLibrary.isServiceOrderCreateEnabled(context);
            break;
        case '#sap_mobile.S4ServiceRequestPartner':
        case '#sap_mobile.S4ServiceRequest':
            enabled = S4ServiceAuthorizationLibrary.isServiceRequestCreateEnabled(context);
            break;
        case '#sap_mobile.S4ServiceQuotationPartner':
        case '#sap_mobile.S4ServiceQuotation':
        case '#sap_mobile.S4ServiceQuotationItem':
            enabled = S4ServiceAuthorizationLibrary.isServiceQuotationCreateEnabled(context);
            break;
        case '#sap_mobile.S4ServiceConfirmationPartner':
        case '#sap_mobile.S4ServiceConfirmation':
        case '#sap_mobile.S4ServiceConfirmationItem':
            enabled = S4ServiceAuthorizationLibrary.isServiceConfirmationCreateEnabled(context);
            break;
        case '#sap_mobile.MyWorkOrderPartner':
        case '#sap_mobile.MyWorkOrderHeader':
            enabled = EnableWorkOrderCreate(context);
            break;
        default:
            break;
    }

    return enabled;
}
