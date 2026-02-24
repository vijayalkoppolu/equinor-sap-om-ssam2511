
import { getParentEntity, PARENT_ENTITY_TYPE } from './DocumentEditorObjectLink';

export default async function DocumentEditorCreateInfo(context, binding = context.binding) {
    switch (binding['@odata.type']) {
        case '#sap_mobile.MyWorkOrderDocument':
            return createInfoForHeaderOrItemParent(context, binding, {
                headerNav: 'WOHeader',
                itemNav: 'WOOperation_Nav',
                entitySet: 'MyWorkOrderDocuments',
                itemEntitySet: 'MyWorkOrderOperations',
                headerEntitySet: 'MyWorkOrderHeaders',
                headerProperties: { ObjectKey: binding.ObjectKey, OrderId: binding.OrderId },
                itemProperties: { ObjectKey: binding.ObjectKey },
            });
        case '#sap_mobile.MyNotifDocument':
            return createInfoObject(
                'MyNotifDocuments',
                'MyNotificationHeaders',
                'NotifHeader',
                `MyNotificationHeaders('${binding.NotificationNumber}')`,
                { ObjectKey: binding.NotificationNumber },
            );
        case '#sap_mobile.MyFuncLocDocument':
            return createInfoObject(
                'MyFuncLocDocuments',
                'MyFunctionalLocations',
                'FunctionalLocation',
                `MyFunctionalLocations('${binding.FuncLocIdIntern}')`,
                { ObjectKey: binding.FuncLocIdIntern },
            );
        case '#sap_mobile.MyEquipDocument':
            return createInfoObject(
                'MyEquipDocuments',
                'MyEquipments',
                'Equipment',
                `MyEquipments('${binding.EquipId}')`,
                { ObjectKey: binding.EquipId },
            );
        case '#sap_mobile.S4ServiceOrderDocument':
            return createInfoForHeaderOrItemParent(context, binding, {
                headerNav: 'S4ServiceOrder_Nav',
                itemNav: 'S4ServiceItem_Nav',
                entitySet: 'S4ServiceOrderDocuments',
                itemEntitySet: 'S4ServiceItems',
                headerEntitySet: 'S4ServiceOrders',
                headerProperties: { ObjectKey: binding.ObjectKey, ObjectID: binding.ObjectID },
                itemProperties: { ObjectKey: binding.ObjectKey, ItemNo: binding.ItemNo },
            });
        case '#sap_mobile.S4ServiceConfirmationDocument':
            return createInfoForHeaderOrItemParent(context, binding, {
                headerNav: 'S4ServiceConfirmation_Nav',
                itemNav: 'S4ServiceConfirmationItem_Nav',
                entitySet: 'S4ServiceConfirmationDocuments',
                itemEntitySet: 'S4ServiceConfirmationItems',
                headerEntitySet: 'S4ServiceConfirmations',
                headerProperties: { ObjectKey: binding.ObjectKey, ObjectID: binding.ObjectID },
                itemProperties: { ObjectKey: binding.ObjectKey, ItemNo: binding.ItemNo },
            });
        case '#sap_mobile.S4ServiceQuotationDocument':
            return createInfoForHeaderOrItemParent(context, binding, {
                headerNav: 'S4ServiceQuotation_Nav',
                itemNav: 'S4ServiceQuotItem_QuotDoc',
                entitySet: 'S4ServiceQuotationDocuments',
                itemEntitySet: 'S4ServiceQuotationItems',
                headerEntitySet: 'S4ServiceQuotations',
                headerProperties: { HeaderID: binding.HeaderID, ObjectID: binding.ObjectID },
                itemProperties: { ObjectKey: binding.ObjectKey, ItemNo: binding.ItemNo },
            });
        case '#sap_mobile.S4ServiceRequestDocument':
            return createInfoObject(
                'S4ServiceRequestDocuments',
                'S4ServiceRequests',
                'S4ServiceRequest_Nav',
                `S4ServiceRequests(ObjectID='${binding.ObjectID}',ObjectType='${binding.ObjectType}')`,
                { HeaderID: binding.HeaderID, ObjectID: binding.ObjectID },
            );
        case '#sap_mobile.InspectionLotDocument':
            return createInfoObject(
                'InspectionLotDocuments',
                'InspectionLots',
                'InspectionLot_Nav',
                `InspectionLots('${binding.InspectionLot}')`,
                { ObjectKey: binding.InspectionLot },
            );
        case '#sap_mobile.WCMDocumentItemAttachment':
            return createInfoObject(
                'WCMDocumentItemAttachments',
                'WCMDocumentItems',
                'WCMDocumentItems',
                `WCMDocumentItems(WCMDocument='${binding.WCMDocument}',WCMDocumentItem='${binding.WCMDocumentItem}')`,
                { ObjectKey: binding.ObjectKey },
            );
        case '#sap_mobile.WCMDocumentHeaderAttachment':
            return createInfoObject(
                'WCMDocumentHeaderAttachments',
                'WCMDocumentHeaders',
                'WCMDocumentHeaders',
                `WCMDocumentHeaders('${binding.WCMDocument}')`,
                { ObjectKey: binding.ObjectKey },
            );
        case '#sap_mobile.WCMApplicationAttachment':
            return createInfoObject(
                'WCMApplicationAttachments',
                'WCMApplications',
                'WCMApplications',
                `WCMApplications('${binding.WCMApplication}')`,
                { ObjectKey: binding.ObjectKey },
            );
        case '#sap_mobile.WCMApprovalAttachment':
            return createInfoObject(
                'WCMApprovalAttachments',
                'WCMApprovals',
                'WCMApprovals',
                `WCMApprovals('${binding.WCMApproval}')`,
                { ObjectKey: binding.ObjectKey },
            );
        default:
            return null;
    }
}

async function createInfoForHeaderOrItemParent(context, binding, docConfig) {
    const readLink = binding['@odata.readLink'];
    const parentEntity = await getParentEntity(context, readLink, docConfig.headerNav, docConfig.itemNav);
    if (parentEntity?.type === PARENT_ENTITY_TYPE.ITEM) {
        return createInfoObject(
            docConfig.entitySet,
            docConfig.itemEntitySet,
            docConfig.itemNav,
            parentEntity?.entity?.['@odata.readLink'],
            docConfig.itemProperties,
        );
    }
    return createInfoObject(
        docConfig.entitySet,
        docConfig.headerEntitySet,
        docConfig.headerNav,
        parentEntity?.entity?.['@odata.readLink'],
        docConfig.headerProperties,
    );
}

function createInfoObject(
    entitySet,
    parentEntitySet,
    parentProperty,
    parentReadLink,
    properties,
) {
    return {
        entitySet,
        parentEntitySet,
        parentProperty,
        parentReadLink,
        properties,
    };
}
