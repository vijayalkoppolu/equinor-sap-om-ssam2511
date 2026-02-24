import ODataLibrary from '../../OData/ODataLibrary';
import isAndroid from '../../Common/IsAndroid';

export default function RelatedNotificationIcons(context) {
    let iconImage = [];

    // check if this order requires sync
    if (ODataLibrary.hasAnyPendingChanges(context.getBindingObject())) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }

    return iconImage;
}
