export default function FormatPlantDescription(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Plants', [], `$filter=Plant eq '${context.binding.Plant}'`).then(function(result) {
        if (result && result.length > 0) {
            return `${result.getItem(0).Plant} - ${result.getItem(0).PlantDescription}`;
        } else {
            return context.binding.Plant;
        }
    });
}
