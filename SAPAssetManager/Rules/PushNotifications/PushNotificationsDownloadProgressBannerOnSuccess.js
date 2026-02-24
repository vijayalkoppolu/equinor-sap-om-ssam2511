import AllSyncronizationGroups from '../OData/DefiningRequests/AllSyncronizationGroups';
import libCommon from '../Common/Library/CommonLibrary';
import { WarehouseOrdersTasksDefiningRequestsList } from '../EWM/Common/EWMLibrary';
import { PUSH_NOTIFICATION_OBJECT_TYPES } from './PushNotificationsDownload';


export default function PushNotificationsDownloadProgressBannerOnSuccess(context) {
    const isWHO = libCommon.getStateVariable(context, 'ObjectType') === PUSH_NOTIFICATION_OBJECT_TYPES.WarehouseOrder;
    const definingRequests = isWHO && libCommon.getAppParam(context, 'EWM', 'download.lite') === 'Y' ?
        WarehouseOrdersTasksDefiningRequestsList :
        AllSyncronizationGroups(context);

    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/PushNotifications/PushNotificationsDownload.action',
        'Properties': {
            'DefiningRequests': definingRequests,
            'OnSuccess': '/SAPAssetManager/Rules/PushNotifications/PushNotificationsDownloadSuccessAlertMessage.js',
            'OnFailure': '/SAPAssetManager/Rules/PushNotifications/PushNotificationsDownloadFailureAlertMessage.js',
        },
    });
}
