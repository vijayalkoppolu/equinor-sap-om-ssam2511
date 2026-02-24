import libNotifStatus from '../../MobileStatus/NotificationMobileStatusLibrary';
import ODataLibrary from '../../../OData/ODataLibrary';

export default function NotificationTaskDetailsPopover(context) {
    let isLocal = ODataLibrary.isLocal(context.binding);
    if (!isLocal) {
        return libNotifStatus.isNotificationComplete(context).then(status => {
            if (!status) {
                return context.executeAction('/SAPAssetManager/Actions/Notifications/Task/NotificationTaskDetailsPopover.action');
            }
            return '';
        });
    }
    return context.executeAction('/SAPAssetManager/Actions/Notifications/Task/NotificationTaskDetailsPopover.action');
}
