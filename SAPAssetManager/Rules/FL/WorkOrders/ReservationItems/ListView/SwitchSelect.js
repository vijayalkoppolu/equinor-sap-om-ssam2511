import ComLib from '../../../../Common/Library/CommonLibrary';
import { checkFilters } from './FLResvItemsCountCaption';

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
    } else if (clientAPI.getName() === HEADER_ITEMS.DeselectAll)  {//If DeselectAll is clicked, deselect all items
        
        table.deselectAllItems();
        SetVisibleItem(clientAPI,HEADER_ITEMS.SelectItems);
    } else { //When SelectAll is clicked
        const filters = clientAPI.getPageProxy().getControls()[0]?.filters;
        const { hasReturnedFilter, hasOpenFilter } = checkFilters(filters);
        const confirmFilterCondition = (!hasReturnedFilter && hasOpenFilter);

        ComLib.enableToolBar(clientAPI, page, 'ReturnStock', confirmFilterCondition);
      
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
