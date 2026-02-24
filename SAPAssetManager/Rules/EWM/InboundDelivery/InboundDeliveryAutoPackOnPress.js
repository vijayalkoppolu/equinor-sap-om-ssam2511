import ODataLibrary from '../../OData/ODataLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import EWMLibrary, { WarehouseTaskStatus, AutoPackDefiningRequestsList } from '../Common/EWMLibrary';
import Logger from '../../Log/Logger';

const UPLOAD_CATEGORY = 'InboundDeliveryAutoPack';

export default async function InboundDeliveryAutoPackOnPress(context) {
    const pageProxy = context.getPageProxy();

    if (await libCommon.getEntitySetCount(context, `${context.binding['@odata.readLink']}/WarehouseTask_Nav`, `$filter=WTStatus eq '${WarehouseTaskStatus.Open}'`)) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericErrorDialog.action',
            'Properties': {
                'OKCaption': context.localizeText('ok'),
                'Title': context.localizeText('error'),
                'Message': context.localizeText('handling_unit_create_error_task_open'),
            },
        });
    }

    try {
        const data = await createAutoPackRecord(pageProxy);

        const createdAutoPack = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;

        await uploadAutoPackRecord(pageProxy, [`${UPLOAD_CATEGORY}_${createdAutoPack.DocumentID}`]);

        const activityIndicatorId = context.showActivityIndicator(context.localizeText('auto_packing_in_progress'));

        const errorArchive = await context.read('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', [], '');

        if (errorArchive.length && errorArchive.some(err => err.AffectedEntity?.['@odata.readLink'] === createdAutoPack['@odata.readLink'])) {
            context.dismissActivityIndicator(activityIndicatorId);

            return context.executeAction({
                Name: '/SAPAssetManager/Actions/OData/ODataUploadFailureMessage.action',
                Properties: {
                    Message: context.localizeText('auto_packing_upload_failed'),
                    OnSuccess: null,
                },
            });
        }

        await downloadAfterAutoPack(pageProxy);

        context.dismissActivityIndicator(activityIndicatorId);

        await context.executeAction({
            Name: '/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action',
            Properties: {
                Message: context.localizeText('auto_packing_success_message'),
            },
        });
    } catch (error) {
        Logger.error('InboundDeliveryAutoPackOnPress error:', error);
    }
}

async function createAutoPackRecord(context) {
    const binding = context.binding;

    const createdRecord = await context.read('/SAPAssetManager/Services/AssetManager.service', 'AutoPacks', [], `$filter=DocumentCategory eq '${binding.DocCategory}' and DocumentID eq '${binding.DocumentID}'`);

    if (createdRecord.length > 0) {
        // If the record already exists, return it instead of creating a new one
        return { data: createdRecord.getItem(0) };
    }

    const docId = binding.DocumentID;

    return context.executeAction({
        Name: '/SAPAssetManager/Actions/Common/GenericCreate.action',
        Properties: {
            Target: {
                EntitySet: 'AutoPacks',
            },
            Properties: {
                DocumentCategory: binding.DocCategory,
                DocumentID: docId,
            },
            RequestOptions: {
                UploadCategory: `${UPLOAD_CATEGORY}_${docId}`,
            },
            Headers: {
                'OfflineOData.RemoveAfterUpload': true,
            },
        },
    });
}

function uploadAutoPackRecord(context, UploadCategories) {
    return context.executeAction({
        Name: '/SAPAssetManager/Actions/OData/UploadOfflineData.action',
        Properties: {
            UploadCategories,
            ShowActivityIndicator: true,
            ActivityIndicatorText: context.localizeText('auto_packing_in_progress'),
        },
    });
}

async function downloadAfterAutoPack(context) {
    await ODataLibrary.initializeOnlineService(context);

    const result = EWMLibrary.isDownloadLiteEnabled(context) ? AutoPackDefiningRequestsList : await context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'ModifiedEntities', [], '');

    return context.executeAction({
        Name: '/SAPAssetManager/Actions/Documents/DownloadOfflineOData.action',
        Properties: {
            DefiningRequests: result.map(entity => {
                const name = typeof entity === 'string' ? entity : entity.EntityName;

                return {
                    Name: name,
                    Query: name,
                };
            }),
            ShowActivityIndicator: true,
            ActivityIndicatorText: context.localizeText('auto_packing_in_progress'),
            OnSuccess: null,
        },
    });
}
