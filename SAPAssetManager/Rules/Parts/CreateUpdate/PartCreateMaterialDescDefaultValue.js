import val from '../../Common/Library/ValidationLibrary';
import PartDescription from '../PartDescription';

export default function PartCreateMaterialDescDefaultValue(context, binding = context.binding) {
    if (binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue() || binding.bomItem) {
        if (!val.evalIsEmpty(binding.Material_Nav)) {
            return binding.Material_Nav.Description;
        } else {
            return PartDescription(context);
        }
    }
    return '';
}
