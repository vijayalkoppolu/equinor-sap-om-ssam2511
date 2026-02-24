import ODataLibrary from '../OData/ODataLibrary';
export default function DataTableEditIcon(context) {
    if (ODataLibrary.hasAnyPendingChanges(context.getBindingObject())) {
            return '/SAPAssetManager/Images/grid_edit.png';
    }
    return '/SAPAssetManager/Images/no_grid_icon.png';
}
