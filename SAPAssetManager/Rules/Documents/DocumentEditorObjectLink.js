import libCom from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import S4ServiceLibrary from '../ServiceOrders/S4ServiceLibrary';

export const PARENT_ENTITY_TYPE = Object.freeze({
    HEADER: 'HEADER',
    ITEM: 'ITEM',
});

export default async function DocumentEditorObjectLink(context, binding = context.binding) {
    let paramName = '';
    const readLink = binding['@odata.readLink'];

    switch (binding['@odata.type']) {
        case '#sap_mobile.MyWorkOrderDocument': {
            const parentEntity = await getParentEntity(context, readLink, 'WOHeader', 'WOOperation_Nav');
            paramName = parentEntity?.type === PARENT_ENTITY_TYPE.ITEM ? 'WorkOrderOperation' : 'WorkOrder';
            break;
        }
        case '#sap_mobile.MyNotifDocument':
            paramName = 'Notification';
            break;
        case '#sap_mobile.MyFuncLocDocument':
            paramName = 'FunctionalLocation';
            break;
        case '#sap_mobile.MyEquipDocument':
            paramName = 'Equipment';
            break;
        case '#sap_mobile.S4ServiceOrderDocument':
            return getS4ObjectLink(context, readLink, 'S4ServiceOrder_Nav', 'S4ServiceItem_Nav', S4ServiceLibrary.getServiceOrderObjectType);
        case '#sap_mobile.S4ServiceConfirmationDocument':
            return getS4ObjectLink(context, readLink, 'S4ServiceConfirmation_Nav', 'S4ServiceConfirmationItem_Nav', S4ServiceLibrary.getServiceConfirmationObjectType);
        case '#sap_mobile.S4ServiceQuotationDocument':
            return getS4ObjectLink(context, readLink, 'S4ServiceQuotation_Nav', 'S4ServiceQuotItem_QuotDoc', S4ServiceLibrary.getServiceOrderObjectType);
        case '#sap_mobile.S4ServiceRequestDocument':
            return S4ServiceLibrary.getServiceRequestObjectType(context);
        case '#sap_mobile.InspectionLotDocument':
            paramName = 'InspectionLot';
            break;
        case '#sap_mobile.WCMDocumentItemAttachment':
            paramName = 'WCMDocumentItem';
            break;
        case '#sap_mobile.WCMDocumentHeaderAttachment':
            paramName = 'WCMDocumentHeader';
            break;
        case '#sap_mobile.WCMApplicationAttachment':
            paramName = 'WCMApplication';
            break;
        case '#sap_mobile.WCMApprovalAttachment':
            paramName = 'WCMApproval';
            break;
        case '#sap_mobile.MyWorkOrderTool':
            paramName = 'WorkOrderTool';
            break;
        default:
            break;
    }
    return libCom.getAppParam(context, 'DOCUMENT', paramName);
}

export async function getParentEntity(context, readLink, headerNavLink, itemNavlink) {
    try {
        const result = await context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], `$expand=${headerNavLink},${itemNavlink}`);
        let entity = result.getItem(0);
    
        if (entity) {
            return entity[itemNavlink] ? {
                type: PARENT_ENTITY_TYPE.ITEM,
                entity: entity[itemNavlink],
            } : {
                type: PARENT_ENTITY_TYPE.HEADER,
                entity: entity[headerNavLink],
            };
        }
        return null;
    } catch (error) {
        Logger.error('getParentEntity', error);
        return null;
    }
}

async function getS4ObjectLink(context, readLink, headerNavLink, itemNavLink, headerFn) {
    const parentEntity = await getParentEntity(context, readLink, headerNavLink, itemNavLink);
    if (parentEntity?.type === PARENT_ENTITY_TYPE.ITEM) {
        return parentEntity.entity?.ItemObjectType || '';
    }
    return headerFn(context);
}
