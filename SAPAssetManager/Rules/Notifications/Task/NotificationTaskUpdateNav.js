import libCommon from '../../Common/Library/CommonLibrary';
import libNotifStatus from '../MobileStatus/NotificationMobileStatusLibrary';
import ODataLibrary from '../../OData/ODataLibrary';

export default function NotificationTaskUpdateNav(context) {
    let isLocal = ODataLibrary.isLocal(context.binding);
    libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
    if (!isLocal) {
        return libNotifStatus.isNotificationComplete(context).then(status => {
            if (!status) {
                return context.executeAction('/SAPAssetManager/Actions/Notifications/Task/NotificationTaskCreateUpdateNav.action');
            }
            return '';
        });
    }
    return context.executeAction('/SAPAssetManager/Actions/Notifications/Task/NotificationTaskCreateUpdateNav.action');
}
