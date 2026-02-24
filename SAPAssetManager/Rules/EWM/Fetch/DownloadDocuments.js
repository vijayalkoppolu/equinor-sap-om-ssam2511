import libVal from '../../Common/Library/ValidationLibrary';
import errorLibrary from '../../Common/Library/ErrorLibrary';
import logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';
import { DocumentTypes } from '../Common/EWMLibrary';
export default function DownloadDocuments(context) {
    let documents = libCom.getStateVariable(context, 'Documents');

    if (libVal.evalIsEmpty(documents)) {
        const messageText = context.localizeText('document_quantity_zero_error');
        const captionText = context.localizeText('error');
        return libCom.showErrorDialog(context, messageText, captionText);
    }
    
    return documents.reduce((promise, document) => {
        return promise.then(() => {
            const promises = [];
            let downloadDocs;

            if (document.DocumentType === DocumentTypes.WarehouseInboundDelivery) {
                libCom.setStateVariable(context, 'ObjectId', `${document.DocumentID}`);
                libCom.setStateVariable(context, 'ObjectType', DocumentTypes.WarehouseInboundDelivery);
                libCom.setStateVariable(context, 'Action', 'I');
                downloadDocs = context.executeAction({'Name':'/SAPAssetManager/Actions/Inventory/Fetch/OnDemandObjectCreate.action', 'Properties': {
                    'Headers': {
                        'OfflineOData.RemoveAfterUpload': true,
                    },
                }});
            } else {
                libCom.setStateVariable(context, 'ObjectId', `${document.WarehouseNo}${document.WarehouseOrder}`);
                libCom.setStateVariable(context, 'ObjectType', DocumentTypes.WarehouseOrder);
                libCom.setStateVariable(context, 'Action', 'I');
                downloadDocs = context.executeAction({'Name':'/SAPAssetManager/Actions/Inventory/Fetch/OnDemandObjectCreate.action', 'Properties': {
                    'Headers': {
                        'OfflineOData.RemoveAfterUpload': true,
                    },
                }});
                const EWMResource = libCom.getStateVariable(context, 'EWMResource');
                if (EWMResource) {
                    const assignOrder = context.executeAction({'Name':'/SAPAssetManager/Actions/EWM/WarehouseOrders/WarehouseOrderCreate.action', 'Properties': {
                        'Properties': {
                            'WarehouseNo' : document.WarehouseNo,
                            'WarehouseOrder': document.WarehouseOrder,
                            'Resource': EWMResource,
                            'AssignRSRC': 'X',
                    },
                    'Headers': {
                        'OfflineOData.RemoveAfterUpload': true,
                        'OfflineOData.TransactionID': `${document.WarehouseNo}${document.WarehouseOrder}${EWMResource}`,
                    },
                    'RequestOptions': {
                        'UploadCategory': 'OnEWMDocsOnly',
                    },
                    }});
                    promises.push(assignOrder);
                }
            }

            promises.push(downloadDocs);
            return Promise.all(promises).catch((error) => {
                libCom.setStateVariable(context, 'DownloadEWMDocsStarted', false);
                logger.error('DownloadDocuments', error);
            });
        });
    }, Promise.resolve())
        .then(() => {
            errorLibrary.clearError(context);
            return context.executeAction('/SAPAssetManager/Actions/EWM/Fetch/FetchDocumentsProgressBanner.action');
        });
}
