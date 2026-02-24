import { HUDelItemsDownloadAllowedStatus } from '../../Common/FLLibrary';
/**
 * Fetches the list of HU/Delivery Item statuses for the picker
 * @param {IClientAPI} context
 */
export default async function HUDelItemsStatusPickerItems(context) {
    const statusFilters = Object.values(HUDelItemsDownloadAllowedStatus).map(status => `FldContainerItemStatus eq '${status}'`).join(' or ');
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsContainerItemStatuses', [], `$filter=${statusFilters}&$orderby=FldContainerItemStatusDesc`)
        .then((items) => Array.from(items)
        .map(item => ({
            'DisplayValue': `${item.FldContainerItemStatusDesc}`,
            'ReturnValue': `${item.FldContainerItemStatus}`,
        })));
}
