export default function IsSelected(clientAPI) {
    if (clientAPI.getSelectedItemsCount() === 0) {
        return false;
    } else if ( clientAPI.getParent().getParent()._control.sections[0].binding.length === clientAPI.getSelectedItemsCount()) {
        return true;
    } else {
    const currentReadLink = clientAPI.binding['@odata.readLink'];
    const selectedItems = clientAPI.getSelectedItems() || [];
    return selectedItems.some(item => item.binding['@odata.readLink'] === currentReadLink);
    }

}

