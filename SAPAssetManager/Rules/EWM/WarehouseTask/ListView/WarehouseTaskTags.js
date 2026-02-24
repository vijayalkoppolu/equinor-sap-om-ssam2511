export default function WarehouseTaskTags(context) {
    const binding = context.binding;
    const tags = [];

    if (!binding?.ProcCategory) {
        tags.push({
            Text: context.localizeText('process_category_x', ['-']),
        });
        return tags;
    }

    return context.read(
        '/SAPAssetManager/Services/AssetManager.service',
        'WarehouseProcessCategories',
        ['Description'],
        `$filter=ProcCategory eq '${binding.ProcCategory}'`).then(result => {
        let description = '-';
        if (result.length > 0) {
            description = result.getItem(0).Description || '-';
        }
        tags.push({
            Text: context.localizeText('process_category_x', [description]),
        });
        return tags;
    }).catch(() => {
        tags.push({
            Text: context.localizeText('process_category_x', ['-']),
        });
        return tags;
    });
}
