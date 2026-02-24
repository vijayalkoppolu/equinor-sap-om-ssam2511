export default function PartCreateMaterialNumberDefaultValue(context, binding = context.binding) {
    if (binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue()) {
        return binding.Component;
    } else if (binding.bomItem) {
        return binding.MaterialNum;
    }
    return '';
}
