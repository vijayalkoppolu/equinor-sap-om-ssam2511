import NetworkLib from '../../Common/Library/NetworkMonitoringLibrary';
import IsSyncInProgress from '../../Sync/IsSyncInProgress';
import ODataLibrary from '../../OData/ODataLibrary';
import EWMLibrary, { AutoTaskCreationDefiningRequestsList } from '../Common/EWMLibrary';
import Logger from '../../Log/Logger';

export default async function WarehouseTaskOnAutoCreatePress(context) {
    const pageProxy = context.getPageProxy();
    const binding = pageProxy.getBindingObject();

    if (!NetworkLib.isNetworkConnected(pageProxy)) {
        return pageProxy.executeAction('/SAPAssetManager/Actions/SyncError/SyncErrorNoConnection.action');
    }
    if (IsSyncInProgress(context)) {
        return context.executeAction('/SAPAssetManager/Actions/SyncInProgress.action');
    }
    if (binding['@odata.type'] !== '#sap_mobile.WarehouseInboundDelivery') {
        return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntityFailureMessage.action');
    }

    try {
        const data = await context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/WarehouseTaskAutoCreate.action');
        const createdAutoWarehouseTask = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;

        await uploadAutoWarehouseTask(context);

        const activityIndicatorId = context.showActivityIndicator(context.localizeText('auto_task_in_progress'));
        const errorArchive = await context.read('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', [], '');

        if (errorArchive.length && errorArchive.some(err => err.AffectedEntity?.['@odata.readLink'] === createdAutoWarehouseTask['@odata.readLink'])) {
            context.dismissActivityIndicator(activityIndicatorId);
            return context.executeAction({
                Name: '/SAPAssetManager/Actions/OData/ODataUploadFailureMessage.action',
                Properties: {
                    Message: context.localizeText('auto_task_upload_failed'),
                    OnSuccess: null,
                },
            });
        }

        await downloadAfterAutoTaskCreation(context);
        context.dismissActivityIndicator(activityIndicatorId);

        return await context.executeAction({
            Name: '/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action',
            Properties: {
                Message: context.localizeText('auto_task_success'),
                MaxNumberOfLines: 2,
            },
        });

    } catch (error) {
        Logger.error('AutoWarehouseTaskCreation error:', error);
        return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntityFailureMessage.action');
    }
}

function uploadAutoWarehouseTask(context) {
    return context.executeAction({
        Name: '/SAPAssetManager/Actions/OData/UploadOfflineData.action',
        Properties: {
            UploadCategory: 'AutoTaskCreation',
            ShowActivityIndicator: true,
            ActivityIndicatorText: context.localizeText('auto_task_in_progress'),
        },
    });
}

async function downloadAfterAutoTaskCreation(context) {
    await ODataLibrary.initializeOnlineService(context);

    const result = EWMLibrary.isDownloadLiteEnabled(context) ? AutoTaskCreationDefiningRequestsList : await context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'ModifiedEntities', [], '');

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
            ActivityIndicatorText: context.localizeText('auto_task_in_progress'),
            OnSuccess: null,
        },
    });
}

