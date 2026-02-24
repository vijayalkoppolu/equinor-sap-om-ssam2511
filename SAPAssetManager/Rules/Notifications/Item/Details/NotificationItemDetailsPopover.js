import libNotifStatus from '../../MobileStatus/NotificationMobileStatusLibrary';
import ODataLibrary from '../../../OData/ODataLibrary';

export default function NotificationItemDetailsPopover(context) {
    let isLocal = ODataLibrary.isLocal(context.binding);
    if (!isLocal) {
        return libNotifStatus.isNotificationComplete(context).then(status => {
            if (!status) {
                return context.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemDetailsPopover.action');
            }
            return '';
        });
    }
    return context.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemDetailsPopover.action');
}
