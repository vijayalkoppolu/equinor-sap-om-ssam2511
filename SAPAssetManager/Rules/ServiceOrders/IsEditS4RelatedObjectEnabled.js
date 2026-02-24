import CommonLibrary from '../Common/Library/CommonLibrary';
import S4ServiceAuthorizationLibrary from '../UserAuthorizations/S4ServiceAuthorizationLibrary';
import EnableWorkOrderEdit from '../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';

export default function IsEditS4RelatedObjectEnabled(context, binding = context.binding) {
    let enabled = true;

    const entityName = binding?.['@odata.type'];
    switch (entityName) {
        case '#sap_mobile.S4ServiceOrderLongText':
        case '#sap_mobile.S4ServiceOrderPartner':
        case '#sap_mobile.S4ServiceOrder':
        case '#sap_mobile.S4ServiceItem':
        case '#sap_mobile.S4ServiceOrderRefObj':
            enabled = S4ServiceAuthorizationLibrary.isServiceOrderEditEnabled(context);
            break;
        case '#sap_mobile.S4ServiceRequestLongText':
        case '#sap_mobile.S4ServiceRequest':
        case '#sap_mobile.S4ServiceRequestPartner':
        case '#sap_mobile.S4ServiceRequestRefObj':
            enabled = S4ServiceAuthorizationLibrary.isServiceRequestEditEnabled(context);
            break;
        case '#sap_mobile.S4ServiceQuotationLongText':
        case '#sap_mobile.S4ServiceQuotationItem':
        case '#sap_mobile.S4ServiceQuotation':
        case '#sap_mobile.S4ServiceQuotationRefObj':
            enabled = S4ServiceAuthorizationLibrary.isServiceQuotationEditEnabled(context);
            break;
        case '#sap_mobileS4ServiceConfirmationLongText':
        case '#sap_mobile.S4ServiceConfirmation':
        case '#sap_mobile.S4ServiceConfirmationItem':
            enabled = S4ServiceAuthorizationLibrary.isServiceConfirmationEditEnabled(context);
            break;
        case '#sap_mobile.S4BusinessPartnerLongText': 
            enabled = IsEditS4RelatedObjectEnabled(context, context.getPageProxy().getBindingObject());
            break;
        case '#sap_mobile.MyWorkOrderPartner':
        case '#sap_mobile.MyWorkOrderHeader':
            enabled = EnableWorkOrderEdit(context);
            break;
        default:
            break;
    }

    return enabled || CommonLibrary.isEntityLocal(binding);
}
