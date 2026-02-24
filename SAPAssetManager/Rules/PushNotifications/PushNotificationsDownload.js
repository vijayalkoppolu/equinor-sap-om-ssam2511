import Logger from '../Log/Logger';
import setSyncInProgressState from '../Sync/SetSyncInProgressState';

export const PUSH_NOTIFICATION_OBJECT_TYPES = {
    WarehouseOrder: 'WarehouseOrder',
    WorkOrder: 'WorkOrder',
    Notification: 'Notification',
    ServiceOrder: 'ServiceOrder',
};

export default function PushNotificationsDownload(context, ObjectType) {
    if ([
        PUSH_NOTIFICATION_OBJECT_TYPES.WarehouseOrder,
        PUSH_NOTIFICATION_OBJECT_TYPES.Notification,
        PUSH_NOTIFICATION_OBJECT_TYPES.ServiceOrder,
        PUSH_NOTIFICATION_OBJECT_TYPES.WorkOrder,
    ].includes(ObjectType)) {
        return context.executeAction('/SAPAssetManager/Actions/PushNotifications/PushNotificationsDownloadInProgress.action');
    } else {
        // If there are errors, set the sync in progress to false
        setSyncInProgressState(context, false);
        Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPushNotification.global').getValue(), 'Push is not implemented for ' + ObjectType + ' entity set');
    }

}
