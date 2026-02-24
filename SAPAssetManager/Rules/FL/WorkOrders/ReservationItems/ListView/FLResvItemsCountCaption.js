import ComLib from '../../../../Common/Library/CommonLibrary';
import { ResvItemListFilterAndSearchQuery, RESVITEM_OPEN_FILTER, RESVITEM_RETURNED_FILTER } from './FLResvItemsListViewQuery';

export default function FLResvItemsCountCaption(clientAPI) {
    const totalCountQueryOptions = ResvItemListFilterAndSearchQuery(clientAPI, false);
    const countQueryOptions = ResvItemListFilterAndSearchQuery(clientAPI);

    const totalCountPromise = ComLib.getEntitySetCount(clientAPI, `${clientAPI.getPageProxy().binding['@odata.readLink']}/FldLogsWoResvItem_Nav`, totalCountQueryOptions);
    const countPromise = ComLib.getEntitySetCount(clientAPI, `${clientAPI.getPageProxy().binding['@odata.readLink']}/FldLogsWoResvItem_Nav`, countQueryOptions);

    return Promise.all([countPromise, totalCountPromise]).then(([count, totalCount]) => {

        const selectItems = clientAPI.getParent().getItem('SelectItems');
        const filters = clientAPI.getParent().getParent().getParent().filters;
        const page = ComLib.getPageName(clientAPI);
        const { hasReturnedFilter, hasOpenFilter } = checkFilters(filters);
        if (hasReturnedFilter) {
            ComLib.enableToolBar(clientAPI, page, 'ReturnStock', false);
            selectItems?.setEnabled(false);
        } else {
            if ((count > 0) && (hasOpenFilter)) {
                if (!selectItems?.getEnabled()) {
                    selectItems?.setEnabled(true);
                }
            } else {
                selectItems?.setEnabled(false);
            }
        }
        if (count === 0) {
            ComLib.enableToolBar(clientAPI, page, 'ReturnStock', false);
        }
        if (clientAPI.getSelectionMode() === 'Multiple') {
            ComLib.enableToolBar(clientAPI, page, 'ReturnStock', !hasReturnedFilter && clientAPI.getSelectedItemsCount() > 0);
            SetToolbarVisible(clientAPI, page, !hasReturnedFilter);
        }

        if (count === totalCount) {

            return clientAPI.localizeText('items_x', [totalCount]);
        }

        return clientAPI.localizeText('items_x_x', [count, totalCount]);
    });
}

export function checkFilters(filters) {
    const hasReturnedFilter = filters?.some(filter => filter.filterItems?.includes(RESVITEM_RETURNED_FILTER));
    const hasOpenFilter = filters?.some(filter => filter.filterItems?.includes(RESVITEM_OPEN_FILTER));
    return { hasReturnedFilter, hasOpenFilter };
}

export function SetToolbarVisible(clientAPI, page, visible = true) {
    clientAPI.evaluateTargetPath('#Page:' + page).getFioriToolbar().getItems().find(item => item.name === 'ReturnStock').setVisible(visible);
}
