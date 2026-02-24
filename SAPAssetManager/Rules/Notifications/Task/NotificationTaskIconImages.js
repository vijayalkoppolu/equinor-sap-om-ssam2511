import ODataLibrary from '../../OData/ODataLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

export default function NotificationTaskIconImages(context) {
    let iconImage = [];

    // check if this Notification Task has been locally created
    if (ODataLibrary.hasAnyPendingChanges(context.getBindingObject())) {
        iconImage.push(libCommon.GetSyncIcon(context));
    }
    // Check mobile status
    if (['COMPLETED', 'SUCCESS'].includes(libMobile.getMobileStatus(context.binding, context))) {
        iconImage.push('/SAPAssetManager/Images/stepCheckmarkIcon.png');
    }
    return iconImage;
}
