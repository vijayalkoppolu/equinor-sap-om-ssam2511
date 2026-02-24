export default function PartMaterialIsVisible(context, binding = context.binding) {
    return binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue() || !!binding.bomItem;
}
