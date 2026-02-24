/**
 * Fetches the list of Recommended Actions for the picker
 * @param {IClientAPI} context
 */
export default async function RecommendedActionPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsRecommendedActions', [], '$orderby=FldLogsRecommendedActionText')
        .then((items) => Array.from(items)
        .map(item => ({
            'DisplayValue': `${item.FldLogsRecommendedActionText} - ${item.FldLogsRecommendedAction}`,
            'ReturnValue': `${item.FldLogsRecommendedAction}`,
        })));
}
