/**
 * Selection mode changed event handler for the table.
 * @param {IClientAPI} clientAPI 
 * @returns Promise<any>
 */

import { SetVisibleItem, HEADER_ITEMS } from './SwitchSelect';


export default function OnProductSelectionModeChanged(clientAPI) {
    const selectionMode = clientAPI.getPageProxy().getControls()[0].getSections()[0].getSelectionMode();
    SetVisibleItem(clientAPI, selectionMode === 'None' ? HEADER_ITEMS.SelectItems : HEADER_ITEMS.SelectAll);
    return Promise.resolve(true);
}

