/**
 * Fetches the list of Return Statuses for the picker
 * @param {IClientAPI} context
 */
export default async function ReturnStatusPickerItems(context) {
    // Only allow these 4 status codes
    const allowedStatuses = ['10', '30', '40', '50'];
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsReturnStatuses', [], '$orderby=FldLogsReturnStatusText')
        .then((items) => Array.from(items)
        .filter(item => allowedStatuses.includes(item.FldLogsReturnStatus))
        .map(item => ({
            'DisplayValue': `${item.FldLogsReturnStatusText} - ${item.FldLogsReturnStatus}`,
            'ReturnValue': `${item.FldLogsReturnStatus}`,
        })));
}
