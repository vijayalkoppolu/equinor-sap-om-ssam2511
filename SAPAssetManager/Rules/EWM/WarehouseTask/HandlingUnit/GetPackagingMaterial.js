export default function GetPackagingMaterial(context) {

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehousePickHUs', [], `$filter=HandlingUnit eq '${context.binding.HandlingUnit}'`).then(result => {
        if (result && result.length > 0) {
            return result.getItem(0).PackMaterial;
        }
        return '';
    });
    
}
