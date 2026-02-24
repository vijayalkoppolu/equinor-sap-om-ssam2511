import EnableFieldServiceTechnician from '../../SideDrawer/EnableFieldServiceTechnician';

export default function PartItemCategoryIsEditable(context, binding = context.binding) {
    if (EnableFieldServiceTechnician(context)) {
        return true;
    }
    return binding['@odata.type'] !== context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue() && !binding.bomItem;
}
