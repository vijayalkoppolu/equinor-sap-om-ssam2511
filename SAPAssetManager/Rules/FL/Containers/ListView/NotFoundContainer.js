import FLDocumentUpdate from '../../Edit/FLDocumentUpdate';
import { ContainerItemStatus, ContainerStatus } from '../../Common/FLLibrary';
import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function NotFoundContainer(clientAPI) {
    const section = clientAPI.getPageProxy().getControl('SectionedTable');
    const page = CommonLibrary.getPageName(clientAPI);
    let notFoundDocuments = [];
    let containerItems = [];
    let containerPackages = [];
    let packageItems = [];
    let updateChildPromises = [];
    let updateChildPackagePromises = [];
    let updateChildContainerPromises = [];

    if (page === 'ContainersListPage') {
        notFoundDocuments = CommonLibrary.getStateVariable(clientAPI, 'CONotFoundorReleasedDocuments') || [];
    }
    if (page === 'PackagesListPage') {
        notFoundDocuments = CommonLibrary.getStateVariable(clientAPI, 'PANotFoundorReleasedDocuments') || [];
    }

    if (notFoundDocuments.length === 0) {
        return Promise.resolve(false);
    }

    const updatePromises = notFoundDocuments.map(item => {
        item.ActionType = 'NOTFOUND';
        item.ContainerStatus = ContainerStatus.NotFound;
        if (page === 'ContainersListPage') {
            containerItems.push(...item.FldLogsContainerItem_Nav);
            containerPackages.push(...item.FldLogsPackage_Nav);
        }
        if (page === 'PackagesListPage') {
            packageItems.push(...item.FldLogsPackageItem_Nav);
        }
        return FLDocumentUpdate(clientAPI, item);
    });

    if (page === 'ContainersListPage') {
        if (containerItems.length > 0) {
            updateChildContainerPromises = containerItems.map(containerItem => {
                containerItem.ActionType = 'NOTFOUND';
                containerItem.ContainerItemStatus = ContainerItemStatus.NotFound;
                return FLDocumentUpdate(clientAPI, containerItem);
            });
        }
        if (containerPackages.length > 0) {
            updateChildPackagePromises = containerPackages.map(packages => {
                packages.ActionType = 'NOTFOUND';
                packages.ContainerStatus = ContainerStatus.NotFound;
                return FLDocumentUpdate(clientAPI,packages);
            });
        }   
    }
    updateChildPromises = [...updateChildContainerPromises , ...updateChildPackagePromises];

    if (page === 'PackagesListPage') {
        if (packageItems.length > 0) {
            updateChildPromises = packageItems.map(packageItem => {
                packageItem.ActionType = 'NOTFOUND';
                packageItem.ContainerItemStatus = ContainerItemStatus.NotFound;
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
            CommonLibrary.enableToolBar(clientAPI, page, 'FLContainerNotFoundItem', false);
            clientAPI.evaluateTargetPathForAPI('#Page:' + page).getControls()[0].redraw();
        }
        if (page === 'PackagesListPage') {
            CommonLibrary.enableToolBar(clientAPI, page, 'FLPackageNotFoundItem', false);
            clientAPI.evaluateTargetPathForAPI('#Page:' + page).getControls()[0].redraw();
        }
        if (page === 'ContainerItemsListPage') {           
            clientAPI.evaluateTargetPathForAPI('#Page:ContainerItemsListPage').getControls()[0].redraw();
            clientAPI.evaluateTargetPathForAPI('#Page:ContainersDetailsPage').getControls()[0].redraw();
        }
        if (page === 'PackageItemsListPage') {
            clientAPI.evaluateTargetPathForAPI('#Page:PackageItemsListPage').getControls()[0].redraw();
            clientAPI.evaluateTargetPathForAPI('#Page:PackageDetailsPage').getControls()[0].redraw();
        }

        const sectionedTable = clientAPI.evaluateTargetPathForAPI('#Page:' + page).getControl('SectionedTable');
        if (sectionedTable && sectionedTable.getSections().length > 0) {
            sectionedTable.getSections()[0].setSelectionMode('None');
        }
        
        CommonLibrary.removeStateVariable(clientAPI, 'CONotFoundorReleasedDocuments');
        CommonLibrary.removeStateVariable(clientAPI, 'PANotFoundorReleasedDocuments');
    });
}
