import FLDocumentUpdate from '../Edit/FLDocumentUpdate';
import { ContainerStatus,ContainerItemStatus } from '../Common/FLLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { ValidateItems } from '../ContainerItems/ReceiveAll';
export default function ReceiveContainer(clientAPI) {
    const section = clientAPI.getPageProxy().getControl('SectionedTable');
    let selectedItems = section.getSections()[0].getSelectedItems()?.map(item => item.binding) || [];
    let page = CommonLibrary.getPageName(clientAPI);
    let containerItems = [];
    let containerPackages = []; 
    let packageItems = [];
    let updateChildPromises = [];
    let updateChildPackagePromises = [];
    let updateChildContainerPromises = [];

    if (page === 'ContainersListPage') {
        selectedItems = CommonLibrary.getStateVariable(clientAPI, 'CONotFoundorReleasedDocuments');
    }
    if (page === 'PackagesListPage') {
        selectedItems = CommonLibrary.getStateVariable(clientAPI, 'PANotFoundorReleasedDocuments');
    }
    if (page === 'HUDelItemsListPage') {
        selectedItems = CommonLibrary.getStateVariable(clientAPI, 'HUDelNotFoundDocuments');
    }

    CommonLibrary.setStateVariable(clientAPI, 'Receive', true);
    if (selectedItems.length === 0) {
        return Promise.resolve(false);
    }

    let items;
    if (page === 'HUDelItemsListPage') {
        items = selectedItems;
    } else {
        items = [].concat.apply([], selectedItems.map(item => item?.FldLogsContainerItem_Nav||item?.FldLogsPackageItem_Nav||item.FldLogsHUDelItemStatus_Nav));
        items = items?.filter(item => item.ContainerItemStatus !== ContainerItemStatus.Received);
    }

    return ValidateItems(clientAPI, items).then((validationResult) => {
        if (!validationResult.allValid) {
               // Combine nested array failedItems into a single array
            const failedItems = validationResult.failedItems.flat();
            CommonLibrary.setStateVariable(clientAPI, 'FailedItems', failedItems);
            section.redraw();
            const actionProperties = {
                'Name': '/SAPAssetManager/Actions/FL/Containers/ReceiveError.action',
                'Properties': {
                    'Message': '$(L,container_mandatory_fields_missing)',
                },
            };

            CommonLibrary.removeStateVariable(clientAPI, 'Receive');
            if (page === 'ContainersListPage') {
                CommonLibrary.removeStateVariable(clientAPI, 'CONotFoundorReleasedDocuments');
            } 
            if (page === 'PackagesListPage') {
                CommonLibrary.removeStateVariable(clientAPI, 'PANotFoundorReleasedDocuments');
            }
            if (page === 'HUDelItemsListPage') {
                CommonLibrary.removeStateVariable(clientAPI, 'HUDelNotFoundDocuments');
            }
            return clientAPI.executeAction(actionProperties);
        }

        const updatePromises = selectedItems.map(item => {
            item.ActionType = 'RECEIVE';
            item.ContainerStatus = ContainerStatus.Received;

            if (page === 'ContainersListPage') {
                containerItems.push(...item.FldLogsContainerItem_Nav);
                containerPackages.push(...item.FldLogsPackage_Nav);
            }
            if (page === 'PackagesListPage') {
                packageItems.push(...item.FldLogsPackageItem_Nav);
            }

            if (page === 'HUDelItemsListPage') {
                item.ContainerItemStatus = ContainerItemStatus.Received;
            }
            return FLDocumentUpdate(clientAPI, item);
        });

        if (page === 'ContainersListPage') {
                if (containerItems.length > 0) {
                    updateChildContainerPromises = containerItems.map(containerItem => {
                        containerItem.ActionType = 'RECEIVE';
                        containerItem.ContainerItemStatus = ContainerItemStatus.Received;
                        return FLDocumentUpdate(clientAPI, containerItem);
                    });
                }
                if (containerPackages.length > 0) {
                    updateChildPackagePromises = containerPackages.map(packages => {
                        packages.ActionType = 'RECEIVE';
                        packages.ContainerStatus = ContainerStatus.Received;
                        return FLDocumentUpdate(clientAPI,packages);
                    });
                }   
        }
        updateChildPromises = [...updateChildContainerPromises , ...updateChildPackagePromises];
        
        if (page === 'PackagesListPage') {
                if (packageItems.length > 0) {
                    updateChildPromises = packageItems.map(packageItem => {
                        packageItem.ActionType = 'RECEIVE';
                        packageItem.ContainerItemStatus = ContainerItemStatus.Received;
                        return FLDocumentUpdate(clientAPI, packageItem);
                    });
                }
            }
        
        const allPromises = [...updatePromises, ...updateChildPromises];

        return Promise.all(allPromises).then(() => {
            const currentFilters = section.filters;
            section.filters = currentFilters;
            section.redraw();

            if (page === 'ContainersListPage') {
                CommonLibrary.enableToolBar(clientAPI, page, 'FLContainerReceiveinFullItem', false);
                clientAPI.evaluateTargetPathForAPI('#Page:' + page).getControls()[0].redraw();
            }

            if (page === 'PackagesListPage') {
                CommonLibrary.enableToolBar(clientAPI, page, 'FLContainerReceiveinFullItem', false);
                clientAPI.evaluateTargetPathForAPI('#Page:' + page).getControls()[0].redraw();
            }
            CommonLibrary.removeStateVariable(clientAPI, 'Receive');
            CommonLibrary.removeStateVariable(clientAPI, 'FailedItems');

            if (page === 'HUDelItemsListPage') {
                CommonLibrary.enableToolBar(clientAPI, page, 'ReceiveItem', false);
                clientAPI.evaluateTargetPathForAPI('#Page:' + page).getControls()[0].redraw();
            }
            CommonLibrary.removeStateVariable(clientAPI, 'CONotFoundorReleasedDocuments');
            CommonLibrary.removeStateVariable(clientAPI, 'PANotFoundorReleasedDocuments');
            CommonLibrary.removeStateVariable(clientAPI, 'HUDelNotFoundDocuments');

            const sectionedTable = clientAPI.evaluateTargetPathForAPI('#Page:' + page).getControl('SectionedTable');
            if (sectionedTable && sectionedTable.getSections().length > 0) {
                sectionedTable.getSections()[0].setSelectionMode('None');
            }
        });
    }) ;
}
