import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ODataLibrary from '../../../OData/ODataLibrary';

export default function EquipCategory(context) {
    if (!CommonLibrary.IsOnCreate(context) && context.binding && !ODataLibrary.hasAnyPendingChanges(context.binding)) {
        return context.binding.EquipCategory;
    }

    return CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'CategoryLstPkr')) || '';
}
