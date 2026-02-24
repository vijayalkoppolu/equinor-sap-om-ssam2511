import FLDocumentUpdate from '../../Edit/FLDocumentUpdate';
import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function ReleaseContainer(clientAPI) {
    const section = clientAPI.getPageProxy().getControl('SectionedTable');
    let page = CommonLibrary.getPageName(clientAPI);
    let releasedDocuments = [];

    if (page === 'ContainersListPage') {
        releasedDocuments = CommonLibrary.getStateVariable(clientAPI, 'CONotFoundorReleasedDocuments') || [];
    }

    if (page === 'PackagesListPage') {
        releasedDocuments = CommonLibrary.getStateVariable(clientAPI, 'PANotFoundorReleasedDocuments') || [];
    }

    if (releasedDocuments.length === 0) {
        return Promise.resolve(false);
    }

    const updatePromises = releasedDocuments.map(item => {
        item.ActionType = 'RELEASED';
        item.IsContainerReleased = 'X';
        return FLDocumentUpdate(clientAPI, item);
    });

    return Promise.all(updatePromises).then(() => {
        const currentFilters = section.filters;
        section.filters = currentFilters;
        section.redraw();
        page = CommonLibrary.getPageName(clientAPI);
        CommonLibrary.enableToolBar(clientAPI, page, 'FLContainerRelease', false);
        clientAPI.evaluateTargetPathForAPI('#Page:' + page).getControls()[0].redraw();

        const sectionedTable = clientAPI.evaluateTargetPathForAPI('#Page:' + page).getControl('SectionedTable');
        if (sectionedTable && sectionedTable.getSections().length > 0) {
            sectionedTable.getSections()[0].setSelectionMode('None');
        }

    });
}
