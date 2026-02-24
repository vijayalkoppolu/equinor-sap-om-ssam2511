import { checkFilters } from './WarehouseTaskListCaption';
import ComLib from '../../../Common/Library/CommonLibrary';
import IsUnassignButtonVisible from './IsUnassignButtonVisible';

export const HEADER_ITEMS = Object.freeze({
    SelectItems: 'SelectItems',
    SelectAll: 'SelectAll',
    DeselectAll: 'DeselectAll',
});

export default function SwitchSelect(clientAPI) {
    const table = clientAPI.getPageProxy().getControls()[0].getSections()[0];
    const page = ComLib.getPageName(clientAPI);

    if (clientAPI.getName() === HEADER_ITEMS.SelectItems) {
         table.setSelectionMode('Multiple');
         SetVisibleItem(clientAPI, HEADER_ITEMS.SelectAll);

         clientAPI.getPageProxy().getFioriToolbar().getItems()[1].setVisible(false);
    } else if (clientAPI.getName() === HEADER_ITEMS.DeselectAll)  {//If DeselectAll is clicked, deselect all items
        ComLib.enableToolBar(clientAPI, page, 'ConfirmAll', false);
        clientAPI.getPageProxy().getFioriToolbar().getItems()[0].setVisible(false);

        clientAPI.getPageProxy().getFioriToolbar().getItems()[1].setVisible(IsUnassignButtonVisible(clientAPI));

        table.deselectAllItems();
        SetVisibleItem(clientAPI,HEADER_ITEMS.SelectItems);
    } else { //When SelectAll is clicked
        const filters = clientAPI.getPageProxy().getControls()[0]?.filters;
        const { hasConfirmedFilter, hasOpenFilter } = checkFilters(filters);
        const confirmFilterCondition = (!hasConfirmedFilter && hasOpenFilter);

        ComLib.enableToolBar(clientAPI, page, 'ConfirmAll', confirmFilterCondition);
        clientAPI.getPageProxy().getFioriToolbar().getItems()[0].setVisible(confirmFilterCondition);

        table.setSelectionMode('Multiple');
        table.selectAllItems();
        SetVisibleItem(clientAPI,HEADER_ITEMS.DeselectAll);
    }
}

export function SetVisibleItem(clientAPI, visibleHeaderItem) {
    const table = clientAPI.getPageProxy().getControls()[0].getSections()[0];
    Object.keys(HEADER_ITEMS).forEach(item => {
        const headerItem = table.getHeader().getItem(item);
        if (headerItem) {
            headerItem.setVisible(item === visibleHeaderItem);
        }
    });
}
