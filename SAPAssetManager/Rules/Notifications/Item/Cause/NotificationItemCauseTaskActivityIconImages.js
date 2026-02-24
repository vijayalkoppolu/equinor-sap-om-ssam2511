import libCommon from '../../../Common/Library/CommonLibrary';
import libMobile from '../../../MobileStatus/MobileStatusLibrary';
import ODataLibrary from '../../../OData/ODataLibrary';

export default function NotificationItemCauseTaskActivityIconImages(context) {
    const icons = [];
    // check if this Notification Item Cause has been locally created

    if (ODataLibrary.hasAnyPendingChanges(context.getBindingObject()) ) {
        icons.push(libCommon.GetSyncIcon(context));
    }

    if (['COMPLETED', 'SUCCESS'].includes(libMobile.getMobileStatus(context.binding, context))) {
        icons.push('/SAPAssetManager/Images/stepCheckmarkIcon.png');
    }
    return icons;
}
