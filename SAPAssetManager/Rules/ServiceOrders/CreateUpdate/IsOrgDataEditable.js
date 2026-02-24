import IsOnCreate from '../../Common/IsOnCreate';
import ODataLibrary from '../../OData/ODataLibrary';

export default function IsOrgDataEditable(context) {
    return ODataLibrary.hasAnyPendingChanges(context.binding) || IsOnCreate(context) ? true : false;
}
