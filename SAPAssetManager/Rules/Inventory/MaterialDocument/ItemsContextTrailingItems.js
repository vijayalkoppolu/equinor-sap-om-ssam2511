import ODataLibrary from '../../OData/ODataLibrary';
export default function ItemsContextTrailingItems(context) {
    const local = ODataLibrary.hasAnyPendingChanges(context.binding);
    let actions = [];

    if (local) {
        actions.push('Delete_Item');
    }

    return actions;
}
