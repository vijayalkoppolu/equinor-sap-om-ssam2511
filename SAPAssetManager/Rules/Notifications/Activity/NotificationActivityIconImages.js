import ODataLibrary from '../../OData/ODataLibrary';
import isAndroid from '../../Common/IsAndroid';

export default function NotificationActivityIconImages(context) {
    
    // check if this Notification Item has been locally created
    if (ODataLibrary.hasAnyPendingChanges(context.getBindingObject())) {
        return [isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png'];
    } else {
        return [];
    }
}
