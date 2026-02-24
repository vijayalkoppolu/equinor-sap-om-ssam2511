import ODataLibrary from '../OData/ODataLibrary';
import isAndroid from '../Common/IsAndroid';

export default function DocumentListViewIconImages(controlProxy) {
    if (ODataLibrary.hasAnyPendingChanges(controlProxy.binding)) {
        return [isAndroid(controlProxy) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png'];
    } else {
        return [];
    }
}
