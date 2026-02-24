import ODataLibrary from '../OData/ODataLibrary';
export default function DataTableSyncIcon(context) {
    if (ODataLibrary.hasAnyPendingChanges(context.getBindingObject())) {
        return '/SAPAssetManager/Images/grid_sync.png';
    }
    return '/SAPAssetManager/Images/no_grid_icon.png';
}
