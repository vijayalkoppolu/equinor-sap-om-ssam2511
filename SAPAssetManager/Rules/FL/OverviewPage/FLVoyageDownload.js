import libCom from '../../Common/Library/CommonLibrary';
import logger from '../../Log/Logger';
import errorLibrary from '../../Common/Library/ErrorLibrary';
import { FLDocumentTypeValues } from '../Common/FLLibrary';
export default function FLVoyageDownload(context) {

    const objectId = libCom.getStateVariable(context, 'DocumentObjectId');
    const fLObject = FLDocumentTypeValues.Voyage;
    libCom.setStateVariable(context, 'DownloadFLDocsStarted', true);
    libCom.setStateVariable(context, 'ObjectId', objectId);
    libCom.setStateVariable(context, 'ObjectType', fLObject);
    libCom.setStateVariable(context, 'Action', 'I');

    const documents = [];
    documents.push({
        ObjectId: objectId,
        FLObject: fLObject,
    });

    libCom.setStateVariable(context, 'Documents', documents);

    if (libCom.getStateVariable(context, 'VoyageStatusUpdate')) {
        return context.executeAction('/SAPAssetManager/Actions/FL/Voyages/VoyageUpdateStatus.action')
            .catch((error) => {
                logger.error('UpdateVoyageStatus', error);
                return Promise.reject(error);
            })
            .then(() => {
                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/Inventory/Fetch/OnDemandObjectCreate.action', 'Properties': {
                        'Headers': {
                            'OfflineOData.RemoveAfterUpload': true,
                        },
                    },
                });
            })
            .catch((error) => {
                libCom.setStateVariable(context, 'DownloadFLDocsStarted', false);
                logger.error('DownloadDocuments', error);
                return Promise.reject(error);
            })
            .then(() => {
                errorLibrary.clearError(context);
                return context.executeAction('/SAPAssetManager/Actions/FL/Fetch/FLFetchDocumentsProgressBanner.action');
            });
    } else {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Inventory/Fetch/OnDemandObjectCreate.action', 'Properties': {
                'Headers': {
                    'OfflineOData.RemoveAfterUpload': true,
                },
            },
        }).catch((error) => {
            libCom.setStateVariable(context, 'DownloadFLDocsStarted', false);
            logger.error('DownloadDocuments', error);
            return Promise.reject(error);
        })
            .then(() => {
                errorLibrary.clearError(context);
                return context.executeAction('/SAPAssetManager/Actions/FL/Fetch/FLFetchDocumentsProgressBanner.action');
            });
    }

}
