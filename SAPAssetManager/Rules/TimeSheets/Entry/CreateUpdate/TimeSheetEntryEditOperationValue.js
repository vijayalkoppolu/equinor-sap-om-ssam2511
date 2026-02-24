
export default function TimeSheetEntryEditOperationValue(context) {
    if (context.binding?.OperationReadlink) {
        return Promise.resolve(context.binding.OperationReadlink);
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/MyWOOperation', [], '')
        .then(results => {
            return results.length ? results.getItem(0)['@odata.readLink'] : '';
        })
        .catch(() => {
            return '';
        });
}
