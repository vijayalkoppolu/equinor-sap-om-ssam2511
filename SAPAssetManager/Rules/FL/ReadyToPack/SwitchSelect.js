
export const HEADER_ITEMS = Object.freeze({
    SelectItems: 'SelectItems',
    SelectAll: 'SelectAll',
    DeselectAll: 'DeselectAll',
});

export default async function SwitchSelect(clientAPI) {
    const table = clientAPI.getPageProxy().getControls()[0].getSections()[0];

    if (clientAPI.getName() === HEADER_ITEMS.SelectItems) {
        table.setSelectionMode('Multiple');
        SetVisibleItem(clientAPI, HEADER_ITEMS.SelectAll);
    } else if (clientAPI.getName() === HEADER_ITEMS.DeselectAll) {//If DeselectAll is clicked, deselect all items
       // ComLib.enableToolBar(clientAPI, page, 'InitiateReturnsButton', false);
        table.deselectAllItems();
        SetVisibleItem(clientAPI, HEADER_ITEMS.SelectItems);
    } else { //When SelectAll is clicked
        table.setSelectionMode('Multiple');
        SetVisibleItem(clientAPI, HEADER_ITEMS.DeselectAll);
        setTimeout(() => {
            clientAPI.getPageProxy().getFioriToolbar().redraw();
            table.selectAllItems();
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
