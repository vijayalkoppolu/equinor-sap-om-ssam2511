export default function FormatCategory(context) {
    let category = context.binding.FuncLocType || context.binding.FuncLocCategory;
    return context.read('/SAPAssetManager/Services/AssetManager.service', `FuncLocCategories('${category}')`, [], '').then(function(result) {
        if (result && result.getItem(0)) {
            const description = result.getItem(0).FuncLocCategoryDesc;
            return `${category}${description ? ' - ' + description : ''}`;
        } else {
            return category || '-';
        }
    }, function() {
        return category || '-';
    });
}
