import libCommon from '../../Common/Library/CommonLibrary';
import libNotifStatus from '../MobileStatus/NotificationMobileStatusLibrary';
import ODataLibrary from '../../OData/ODataLibrary';

export default function NotificationItemUpdateNav(context) {
    let isLocal = ODataLibrary.isLocal(context.binding);
    libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
    if (!isLocal) {
        return libNotifStatus.isNotificationComplete(context).then(status => {
            if (!status) {
                return context.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemCreateUpdateNav.action');
            }
            return '';
        });
    }
    return context.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemCreateUpdateNav.action');
}
