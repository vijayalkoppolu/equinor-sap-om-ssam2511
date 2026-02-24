import libVal from '../../Common/Library/ValidationLibrary';
export default function GetMaterialDescription(context,binding) {
    const material = binding?.Material || context.binding.Material;
    const queryOptions = `$filter=MaterialNum eq '${material}'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Materials', [], queryOptions).then((result) => {
        if (!libVal.evalIsEmpty(result)) {
            return `${material} - ${result.getItem(0).Description}`;
        } else {
            return material;
        }
    });
}
