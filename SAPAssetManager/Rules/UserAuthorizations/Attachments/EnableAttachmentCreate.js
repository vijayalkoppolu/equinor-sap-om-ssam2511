/**
* Show/Hide Attachment create/edit based on user authorization
* @param {IClientAPI} context
*/
import DocLib from '../../Documents/DocumentLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import libPersona from '../../Persona/PersonaLibrary';
import DocumentsIsVisible from '../../Documents/DocumentsIsVisible';
import EnableWorkOrderEdit from '../WorkOrders/EnableWorkOrderEdit';
import S4ServiceAuthorizationLibrary from '../S4ServiceAuthorizationLibrary';

export default async function EnableAttachmentCreate(context) {
    if (libPersona.isWCMOperator(context) || !DocumentsIsVisible(context) || libPersona.isInventoryClerk(context)) {
        return false;
    }

    switch (DocLib.getParentObjectType(context)) {
        case DocLib.ParentObjectType.Equipment:
            return (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.EQ.Attach') === 'Y');
        case DocLib.ParentObjectType.FunctionalLocation:
            return (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.FL.Attach') === 'Y');
        case DocLib.ParentObjectType.WorkOrder:
        case DocLib.ParentObjectType.Operation:
        case DocLib.ParentObjectType.SubOperation:
            return await EnableWorkOrderEdit(context);              
        case DocLib.ParentObjectType.Notification:
            return libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.NO.Edit') === 'Y';
        case DocLib.ParentObjectType.S4ServiceOrder:
        case DocLib.ParentObjectType.S4ServiceItem:
            return S4ServiceAuthorizationLibrary.isServiceOrderCreateEnabled(context);
        case DocLib.ParentObjectType.S4ServiceConfirmation:
        case DocLib.ParentObjectType.S4ServiceConfirmationItem:
            return S4ServiceAuthorizationLibrary.isServiceConfirmationCreateEnabled(context);
        case DocLib.ParentObjectType.S4ServiceQuotation:
        case DocLib.ParentObjectType.S4ServiceQuotationItem:
            return S4ServiceAuthorizationLibrary.isServiceQuotationCreateEnabled(context);
        case DocLib.ParentObjectType.S4ServiceRequest:
            return S4ServiceAuthorizationLibrary.isServiceRequestCreateEnabled(context);
        default: 
            return true;
    }
}
