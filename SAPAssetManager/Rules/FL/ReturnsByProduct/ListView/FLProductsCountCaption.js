import ComLib from '../../../Common/Library/CommonLibrary';
import { ProductListFilterAndSearchQuery, PRODUCT_DEFAULT_ATREMOTE, PRODUCT_DEFAULT_RET_SCHED, PRODUCT_DEFAULT_READY_DISP, PRODUCT_DEFAULT_DISPATCH } from '../ReturnsByProductOnLoadQuery';
import { toolBarFilterMapping, toggleToolBar } from '../OnDocumentSelectedOrUnselected';

export default function FLProductsCountCaption(clientAPI) {
    const totalCountQueryOptions = ProductListFilterAndSearchQuery(clientAPI, false);
    const countQueryOptions = ProductListFilterAndSearchQuery(clientAPI, true);

    const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsInitRetProducts', totalCountQueryOptions);
    const countPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsInitRetProducts', countQueryOptions);

    return Promise.all([countPromise, totalCountPromise]).then(([count, totalCount]) => {

        const filters = clientAPI.getParent().getParent().getParent().filters;
        let filterLength = filters ? filters[0].filterItemsDisplayValue.length : 0;
        const filterLabel = filters && filterLength > 0 ? filters[0].filterItemsDisplayValue[0].match(/^[^\(]+/)[0].trim() : '';
        const section = clientAPI.getPageProxy().getControls()[0].getSections()[0];
        const selectedItems = section.getSelectedItems().map(item => item.binding) || [];
        if  (filterLength === 1 && selectedItems.length > 0)  {
            toolBarFilterMapping(filterLabel, clientAPI);
        } else {
            // More than one filter selected or none, disable all toolbar buttons
            toggleToolBar(clientAPI, false);
        }
        const page = ComLib.getPageName(clientAPI);

        if (count === 0 || selectedItems.length === 0) {
            ComLib.enableToolBar(clientAPI, page, 'InitiateReturnsButton', false);
            ComLib.enableToolBar(clientAPI, page, 'FLLoadQuantityButton', false);
        }

        if (count === totalCount) {

            return clientAPI.localizeText('items_x', [totalCount]);
        }

        return clientAPI.localizeText('items_x_x', [count, totalCount]);
    });
}

export function checkFilters(filters) {

    const hasAtRemoteFilter = filters?.some(filter => filter.filterItems?.includes(PRODUCT_DEFAULT_ATREMOTE));
    const hasRetSchedFilter = filters?.some(filter => filter.filterItems?.includes(PRODUCT_DEFAULT_RET_SCHED));
    const hasReadyDispFilter = filters?.some(filter => filter.filterItems?.includes(PRODUCT_DEFAULT_READY_DISP));
    const hasDispatchFilter = filters?.some(filter => filter.filterItems?.includes(PRODUCT_DEFAULT_DISPATCH));
    return { hasAtRemoteFilter, hasRetSchedFilter, hasReadyDispFilter, hasDispatchFilter };
}

export function SetToolbarVisible(clientAPI, page, visible = true) {
    clientAPI.evaluateTargetPath('#Page:' + page).getFioriToolbar().getItems().find(item => item.name === 'InitiateReturnsButton').setVisible(visible);
}
