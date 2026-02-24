import ComLib from '../../../Common/Library/CommonLibrary';

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
    } else if (clientAPI.getName() === HEADER_ITEMS.DeselectAll) {//If DeselectAll is clicked, deselect all items

        ComLib.enableToolBar(clientAPI, page, 'InitiateReturnsButton', false);
        ComLib.enableToolBar(clientAPI, page, 'FLLoadQuantityButton', false);
        ComLib.enableToolBar(clientAPI, page, 'FLDispatchButton', false);
        table.deselectAllItems();
        SetVisibleItem(clientAPI, HEADER_ITEMS.SelectItems);
    } else { //When SelectAll is clicked

        table.setSelectionMode('Multiple');


        SetVisibleItem(clientAPI, HEADER_ITEMS.DeselectAll);
        const filters = clientAPI.getParent().getParent().getParent().filters;
        let filterLength = filters ? filters[0].filterItemsDisplayValue.length : 0;
        const filterLabel = filters && filterLength > 0 ? filters[0].filterItemsDisplayValue[0].match(/^[^\(]+/)[0].trim() : '';
        if (filterLength === 1) {

            switch (filterLabel) {
                case clientAPI.localizeText('fld_remote'):
                    ComLib.enableToolBar(clientAPI, page, 'InitiateReturnsButton', true);
                    break;
                case clientAPI.localizeText('fld_return_scheduled'):
                    ComLib.enableToolBar(clientAPI, page, 'FLLoadQuantityButton', true);
                    break;
                case clientAPI.localizeText('fld_ready_for_dispatch'):
                    ComLib.enableToolBar(clientAPI, page, 'FLDispatchButton', true);
                    ComLib.enableToolBar(clientAPI, page, 'InitiateReturnsButton', false);
                    ComLib.enableToolBar(clientAPI, page, 'FLLoadQuantityButton', false);
                    break;
                default:
                    ComLib.enableToolBar(clientAPI, page, 'InitiateReturnsButton', false);
                    ComLib.enableToolBar(clientAPI, page, 'FLLoadQuantityButton', false);
                    ComLib.enableToolBar(clientAPI, page, 'FLDispatchButton', false);
                    break;
            }
        }
        table.selectAllItems();
        setTimeout(() => {
            clientAPI.getPageProxy().getFioriToolbar().redraw();
        }, 300);


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
