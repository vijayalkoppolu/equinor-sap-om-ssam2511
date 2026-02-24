import { isCountedStatus } from './GetCountDate';

/**
 * Returns the appropriate button title based on the physical inventory count status.
 * @param {IClientAPI} clientAPI - The client API object containing binding data.
 * @returns {string} The localized button title - either count or edit count.
 */

export default function GetCountButtonTitle(clientAPI) {
    if (isCountedStatus(clientAPI)) {
        return clientAPI.localizeText('ewm_edit_count_inventory');
    } else {
        return clientAPI.localizeText('ewm_count_inventory');
    }
}
