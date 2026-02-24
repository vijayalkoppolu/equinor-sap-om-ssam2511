import { checkFilters, SetToolbarVisible } from './WarehouseTaskListCaption';
import ComLib from '../../../Common/Library/CommonLibrary';
import { SetVisibleItem, HEADER_ITEMS } from './SwitchSelect';
import IsUnassignButtonVisible from './IsUnassignButtonVisible';

export default function OnDocumentSelectedOrUnselected(clientAPI) {
    const section = clientAPI.getPageProxy().getControls()[0].getSections()[0];
    const itemCount = section.getSelectedItemsCount();
    const page = ComLib.getPageName(clientAPI);
    const filters = clientAPI.getPageProxy().getControls()[0]?.filters;
    const { hasConfirmedFilter, hasOpenFilter } = checkFilters(filters);
    const confirmFilterCondition = (itemCount > 0 && !hasConfirmedFilter && hasOpenFilter);
    
    ComLib.enableToolBar(clientAPI, page, 'ConfirmAll', confirmFilterCondition);
    SetToolbarVisible(clientAPI, page, confirmFilterCondition);

    clientAPI.getPageProxy().getFioriToolbar().getItems()[0].setVisible(confirmFilterCondition);
    clientAPI.getPageProxy().getFioriToolbar().getItems()[1].setVisible(itemCount ? false : IsUnassignButtonVisible(clientAPI));

    // Only update header buttons if we're still in selection mode
    // This prevents overriding the button state when selection mode is about to exit
    if (section.getSelectionMode() !== 'None') {
        if (itemCount === 0) {
            SetVisibleItem(clientAPI, HEADER_ITEMS.SelectAll);
        } else if (section?._context.element?.binding?.length === itemCount) {
            SetVisibleItem(clientAPI, HEADER_ITEMS.DeselectAll);
        }
    }
    // If selection mode is 'None', let OnSelectionModeChanged handle button state
}
