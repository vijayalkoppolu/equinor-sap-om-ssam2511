import isAndroid from '../../Common/IsAndroid';
import ODataLibrary from '../../OData/ODataLibrary';

export default function ConfirmationItemsListViewIconImages(controlProxy) {
    if (ODataLibrary.isLocal(controlProxy.binding)) {
        let icon = isAndroid(controlProxy) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : 
            '/SAPAssetManager/Images/syncOnListIcon.png';
        return [icon];
    } else {
        return [];
    }
}
