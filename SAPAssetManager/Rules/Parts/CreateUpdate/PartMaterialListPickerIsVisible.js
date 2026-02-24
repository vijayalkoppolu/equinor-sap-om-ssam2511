export default function PartMaterialListPickerIsVisible(context, binding = context.binding) {
    return !(binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue() || binding.bomItem);
}
