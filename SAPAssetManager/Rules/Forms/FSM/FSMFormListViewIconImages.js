import ODataLibrary from '../../OData/ODataLibrary';
import isAndroid from '../../Common/IsAndroid';

export default function FSMFormListViewIconImages(context) {
    let iconImage = [];
    let binding = context.getBindingObject();
    // check if this order requires sync
    if (ODataLibrary.hasAnyPendingChanges(binding)) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }
    return iconImage;
}
