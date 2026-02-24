export default function FormatEquipType(context, equipment) {
    const binding = equipment || context.binding;
    return context.read('/SAPAssetManager/Services/AssetManager.service', `EquipObjectTypes('${binding.EquipType}')`, [], '').then(function(result) {
        if (result && result.getItem(0)) {
            return result.getItem(0).ObjectTypeDesc;
        } else {
            return '-';
        }
    }, function() {
        return '-';
    });
}
