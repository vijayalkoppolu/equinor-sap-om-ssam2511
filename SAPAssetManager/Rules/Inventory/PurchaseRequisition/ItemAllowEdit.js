import ODataLibrary from '../../OData/ODataLibrary';

export default function ItemAllowEdit(context) {
    return ODataLibrary.hasAnyPendingChanges(context.binding);
}
