import FLDocumentUpdate from '../Edit/FLDocumentUpdate';
import { ContainerItemStatus } from '../Common/FLLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import RedrawFilter from './RedrawFilter';
 
export default function NotFoundItem(clientAPI) {
    const page = CommonLibrary.getPageName(clientAPI);
    let notFoundDocuments = [];

    if (page === 'ContainerItemsListPage') {
        notFoundDocuments = CommonLibrary.getStateVariable(clientAPI, 'SelectedContainerItems') || [];
    }
    if (page === 'PackageItemsListPage') {
        notFoundDocuments = CommonLibrary.getStateVariable(clientAPI, 'SelectedContainerItems') || [];
    }
    if (page === 'HUDelItemsListPage') {
        notFoundDocuments = CommonLibrary.getStateVariable(clientAPI, 'HUDelNotFoundDocuments') || [];
    }

    if (notFoundDocuments.length === 0) {
        return Promise.resolve(false);
    }

    const updatePromises = notFoundDocuments.map(item => {
        item.ActionType = 'NOTFOUND';
        item.ContainerItemStatus = ContainerItemStatus.NotFound;
        return FLDocumentUpdate(clientAPI, item); 
    });
 
    return Promise.all(updatePromises).then(() => {
        RedrawFilter(clientAPI);
        if (page === 'ContainerItemsListPage') {           
            clientAPI.evaluateTargetPathForAPI('#Page:ContainerItemsListPage').getControls()[0].redraw();
            clientAPI.evaluateTargetPathForAPI('#Page:ContainersDetailsPage').getControls()[0].redraw();
        }
        if (page === 'PackageItemsListPage') {
            clientAPI.evaluateTargetPathForAPI('#Page:PackageItemsListPage').getControls()[0].redraw();
            clientAPI.evaluateTargetPathForAPI('#Page:PackageDetailsPage').getControls()[0].redraw();
        }
 
        if (page === 'HUDelItemsListPage') {
            clientAPI.evaluateTargetPathForAPI('#Page:HUDelItemsListPage').getControls()[0].redraw();
        }
        const sectionedTable = clientAPI.evaluateTargetPathForAPI('#Page:' + page).getControl('SectionedTable');
        if (sectionedTable && sectionedTable.getSections().length > 0) {
            sectionedTable.getSections()[0].setSelectionMode('None');
        }
    });
}
 
