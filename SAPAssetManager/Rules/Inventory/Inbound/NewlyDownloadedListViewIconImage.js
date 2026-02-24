import isAndroid from '../../Common/IsAndroid';
import ODataLibrary from '../../OData/ODataLibrary';

export default function NewlyDownloadedListViewIconImages(context) {
    let iconImage = [];
    let isLocal = ODataLibrary.isLocal(context.binding);

    if (isLocal) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }

    return iconImage;
}
