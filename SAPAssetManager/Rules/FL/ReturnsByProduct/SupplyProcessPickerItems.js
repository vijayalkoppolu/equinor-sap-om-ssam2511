/**
 * Fetches the list of Supply Processes for the picker
 * @param {IClientAPI} context
 */
export default async function SupplyProcessPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsSupprocs', [], '$orderby=SupplyProcessText')
        .then((items) => Array.from(items)
        .map(item => ({
            'DisplayValue': `${item.SupplyProcessText} - ${item.SupplyProcess}`,
            'ReturnValue': `${item.SupplyProcess}`,
        })));
}
