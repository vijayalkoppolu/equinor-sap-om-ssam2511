import ODataLibrary from '../../OData/ODataLibrary';
export default function RegReadingIsLocal(context) {
    if (ODataLibrary.hasAnyPendingChanges(context.binding)) {
        return '/SAPAssetManager/Images/grid_sync.png';
    }
    return '/SAPAssetManager/Images/no_grid_icon.png';
}
