import { ContainerItemStatus,FLEntitySetNames,ContainerStatus } from '../Common/FLLibrary';
import Logger from '../../Log/Logger';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import FLDocumentUpdate from '../Edit/FLDocumentUpdate';

export default function ItemUpdateOrReceiveMessage(context) {
    if (CommonLibrary.getStateVariable(context, 'BulkFLUpdate')) {
        return Promise.resolve(true);
    }
    const data = context.actionResults.result.data;
    const response = JSON.parse(data);

    const isReceived = (response.ContainerItemStatus === ContainerItemStatus.Received) || (response.ContainerStatus === ContainerStatus.Received);
    const message = isReceived ? context.localizeText('receive_successful') : context.localizeText('update_successful');
    const page = CommonLibrary.getPageName(context);

    const onSuccessAction = (page === 'EditFLDocumentPage') ? '/SAPAssetManager/Rules/FL/BulkUpdate/BulkUpdateClosePage.js' : '';

    const actionProperties = {
        'Name': '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action',
        'Properties': {
            'Message': message,
            'OnSuccess': onSuccessAction,
        },
    };
    const result = JSON.parse(context.actionResults.result.data);
    const readLink = result['@odata.readLink'];
    let entitySet = '';
    if (result && readLink && context.binding) {
        let binding = context.binding;
        entitySet = binding['@odata.readLink'].split('(')[0];
        switch (entitySet) {
            case FLEntitySetNames.Container:
                binding.FldLogsContainerItem_Nav = binding.FldLogsContainerItem_Nav.map(item => {
                    if (item['@odata.readLink'] === result['@odata.readLink']) {
                        return result;
                    }
                    return item;
                });
                break;
            case FLEntitySetNames.Package:
                binding.FldLogsPackageItem_Nav = binding.FldLogsPackageItem_Nav.map(item => {
                    if (item['@odata.readLink'] === result['@odata.readLink']) {
                        return result;
                    }
                    return item;
                });
                break;
        }
        context.setActionBinding(binding);
    }

    const itemPage = entitySet === 'FldLogsContainers' ? 'ContainerItemsListPage' : 'PackageItemsListPage';
    const expandOption = entitySet === 'FldLogsContainers' ? 'FldLogsContainerItem_Nav' : 'FldLogsPackageItem_Nav';
    const queryOptions = `$filter=ContainerID eq '${response.ContainerID}' and DispatchDate eq datetime'${response.DispatchDate}' and DispatchLoc eq '${response.DispatchLoc}' and TripCounter eq '${response.TripCounter}' &$expand=${expandOption}`;

    context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions).then(Container => {
        const container = Container._array[0];
        if (itemPage === 'ContainerItemsListPage' || itemPage === 'PackageItemsListPage') {
            const containerItems = entitySet === 'FldLogsContainers' ? container.FldLogsContainerItem_Nav : container.FldLogsPackageItem_Nav;
            const totalItems = containerItems.length;
            const receivedItems = containerItems.filter(item => item.ContainerItemStatus === ContainerItemStatus.Received).length;

            if (receivedItems === totalItems && container.ContainerStatus !== '30') {
                container.ContainerStatus = '30'; 
                return FLDocumentUpdate(context, container);
            } else if (receivedItems > 0 && receivedItems < totalItems && container.ContainerStatus !== '20') {
                container.ContainerStatus = '20'; 
                return FLDocumentUpdate(context, container);
            }
        }
        return null;
    });

    return context.executeAction(actionProperties).catch(error => {
        Logger.error('FLUpdate', error);
    });
}
