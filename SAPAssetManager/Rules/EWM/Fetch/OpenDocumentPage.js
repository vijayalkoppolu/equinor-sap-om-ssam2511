import libCom from '../../Common/Library/CommonLibrary';
import libEWM from '../Common/EWMLibrary';
import { DocumentTypes } from '../Common/EWMLibrary';
/**
* Used to make an extension of simple close of the page
* if there are only one doc dowloaded, it make redirect to the details page
* if there is openend any modal of fetch doc - it would be closed
* @param {IClientAPI} context
*/
export default function OpenDocumentPage(context) {
    libCom.setStateVariable(context, 'DownloadEWMDocsStarted', false);
    const pageName = libCom.getPageName(context);
    if (pageName === 'EWMFetchOnlineDocumentsPage' || pageName === 'EWMFetchDocumentsPage') {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return modifyDocs(context);
        });
    }
    return modifyDocs(context);
}

function modifyDocs(context) {
    let documents = libCom.getStateVariable(context, 'Documents');
    if (documents.length === 1) {
        return openDoc(context, documents[0]);
    }
    return Promise.resolve(true);
}

function openDoc(context, document) {
    const autoOpenEnabled = (libCom.getAppParam(context, 'EWM', 'search.auto.navigate') === 'Y');
    if (autoOpenEnabled) {
        let query = `$filter=WarehouseNo eq '${document.WarehouseNo}'`;

        switch (document.DocumentType) {
            case DocumentTypes.WarehouseOrder:
                query = query + `and WarehouseOrder eq '${document.WarehouseOrder}'&$expand=WarehouseTask_Nav,WarehouseProcessType_Nav`;
                return libEWM.openEWMDocDetailsPage(context, 'WarehouseOrders', query, DocumentTypes.WarehouseOrder);
            
            case DocumentTypes.WarehouseTask:
                query = query + `and WarehouseTask eq '${document.WarehouseTask}'`;
                return libEWM.openEWMDocDetailsPage(context, 'WarehouseTasks', query, DocumentTypes.WarehouseTask);
            
            case DocumentTypes.WarehousePhysicalInventoryItem:
                query = query + `and ITEM_NO eq '${document.ITEM_NO}' and GUID eq '${document.GUID}'`;
                return libEWM.openEWMDocDetailsPage(context, 'WarehousePhysicalInventoryItems', query, DocumentTypes.WarehousePhysicalInventoryItem);

            case DocumentTypes.WarehouseInboundDelivery:
                query = `$filter=DocumentID eq '${document.DocumentID}'&$expand=WarehouseInboundDeliveryItem_Nav`;
                return libEWM.openEWMDocDetailsPage(context, 'WarehouseInboundDeliveries', query, DocumentTypes.WarehouseInboundDelivery);
        }
    }
    return Promise.resolve(true);
}
