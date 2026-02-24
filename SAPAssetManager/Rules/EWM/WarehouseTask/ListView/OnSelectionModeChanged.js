import { SetVisibleItem, HEADER_ITEMS } from './SwitchSelect';

/**
 * Selection mode changed event handler for the table.
 * @param {IClientAPI} clientAPI 
 * @returns Promise<any>
 */
export default function OnSelectionModeChanged(clientAPI) {
    const selectionModeNone = clientAPI.getPageProxy().getControls()[0].getSections()[0].getSelectionMode() === 'None';
    SetVisibleItem(clientAPI, selectionModeNone ? HEADER_ITEMS.SelectItems : HEADER_ITEMS.SelectAll);
    return Promise.resolve(true);
}
