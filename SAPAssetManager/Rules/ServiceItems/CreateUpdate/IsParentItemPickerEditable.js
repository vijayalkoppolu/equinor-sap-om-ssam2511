import CommonLibrary from '../../Common/Library/CommonLibrary';
import ODataLibrary from '../../OData/ODataLibrary';

export default function IsParentItemPickerEditable(context) {
    return CommonLibrary.IsOnCreate(context) ? true : ODataLibrary.isLocal(context.binding);
}
