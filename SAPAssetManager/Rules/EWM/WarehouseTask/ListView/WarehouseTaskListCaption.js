import ComLib from '../../../Common/Library/CommonLibrary';
import { WarehouseTaskListFilterAndSearchQuery, WAREHOUSE_TASKS_OPEN_FILTER,WAREHOUSE_TASKS_CONFIRMED_FILTER } from './WarehouseTaskListQuery';

export default function WarehouseTaskListCaption(clientAPI) {
    const totalCountQueryOptions = WarehouseTaskListFilterAndSearchQuery(clientAPI, false);
    const countQueryOptions = WarehouseTaskListFilterAndSearchQuery(clientAPI);

    const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'WarehouseTasks', totalCountQueryOptions);
    const countPromise = ComLib.getEntitySetCount(clientAPI, 'WarehouseTasks', countQueryOptions);

    return Promise.all([countPromise, totalCountPromise]).then(([count, totalCount]) => {
        const controls = clientAPI.getPageProxy().getControls()[0];
        const selectItems = controls?.getSections()[0].getHeader().getItem('SelectItems');
        const filters = controls?.filters;
        const page = ComLib.getPageName(clientAPI);
        const { hasConfirmedFilter, hasOpenFilter } = checkFilters(filters);
        if ( hasConfirmedFilter ) {
            ComLib.enableToolBar(clientAPI, page, 'ConfirmAll', false);
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
        if (clientAPI.getSelectionMode() === 'Multiple') {
            ComLib.enableToolBar(clientAPI, page, 'ConfirmAll', !hasConfirmedFilter && clientAPI.getSelectedItemsCount() > 0);
            SetToolbarVisible(clientAPI, page, !hasConfirmedFilter);
        }

        if (count === totalCount) {
            return clientAPI.localizeText('items_x', [totalCount]);
        }
        return clientAPI.localizeText('items_x_x', [count, totalCount]);
    });
}

export function checkFilters(filters) {
    const hasConfirmedFilter = filters?.some(filter => filter.filterItems?.includes(WAREHOUSE_TASKS_CONFIRMED_FILTER));
    const hasOpenFilter = filters?.some(filter => filter.filterItems?.includes(WAREHOUSE_TASKS_OPEN_FILTER));
    return { hasConfirmedFilter, hasOpenFilter };
}

export function SetToolbarVisible(clientAPI, page, visible = true) {
    clientAPI.evaluateTargetPath('#Page:' + page).getFioriToolbar().getItems().find(item => item.name === 'ConfirmAll').setVisible(visible);
}
