import isAndroid from '../Common/IsAndroid';
import ODataLibrary from '../OData/ODataLibrary';

export default function ChecklistListViewIconImages(context) {
    let binding = context.getBindingObject();
    const iconImage = [];

    // check if this checklist requires sync
    if (ODataLibrary.hasAnyPendingChanges(binding) || ODataLibrary.hasAnyPendingChanges(binding.MobileStatus) || ODataLibrary.hasAnyPendingChanges(context, binding.HeaderLongText[0])) {
        if (isAndroid(context)) {
            iconImage.push('/SAPAssetManager/Images/syncOnListIcon.android.png');
        } else {
            iconImage.push('/SAPAssetManager/Images/syncOnListIcon.png');
        }
    }

    return iconImage;
}
