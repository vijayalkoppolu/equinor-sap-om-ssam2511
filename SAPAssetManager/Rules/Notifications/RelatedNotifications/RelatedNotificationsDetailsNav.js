
import libTelemetry from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import NotificationsListViewQueryOption from '../NotificationsListViewQueryOption';
import NotificationDetailsNav from '../Details/NotificationDetailsNav';
import Logger from '../../Log/Logger';
import ExecuteOnlineRequest from '../../OnlineSearch/ExecuteOnlineRequest';

/**
 * Navigate to the notification history record:
 * First try to find the notification on the device and navigate to notification details
 * If not found, then check online service for the header record and navigate to online details
 * Otherwise navigate to history details
 * @param {*} context
 * @param {boolean} [historyOnly=false] - If true, only navigate to history details without checking for device or online records
 * @returns 
 */
export default async function RelatedNotificationsDetailsNav(context, historyOnly=false) {
    try {
        if (!historyOnly) {
            let queryBuilder = await NotificationsListViewQueryOption(context, 'RelatedNotification');
            let query = await queryBuilder.build();
            let row = await context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders', [], query); //Check for notification
            let target = context;

            if (context.getPageProxy) {
                target = context.getPageProxy();
            }

            if (row && row.length > 0) { //Notification exists on device, so navigate to full record
                target.setActionBinding(row.getItem(0));
                return NotificationDetailsNav(target);
            }

            //If the notification does not exist on device, then check online service for header record and navigate to online details
            let onlineResult = await ExecuteOnlineRequest(context, 'NotificationHistorySingleton'); //Read the history record from the online service
            if (onlineResult && onlineResult.length > 0) {
                target.setActionBinding(onlineResult.getItem(0)); //Set the action binding to the online notification
                return target.executeAction('/SAPAssetManager/Actions/Notifications/OnlineNotificationDetailsNav.action');
            }
        }
        //Navigate to history details
        return libTelemetry.executeActionWithLogPageEvent(context,
            '/SAPAssetManager/Actions/Notifications/RelatedNotifications/RelatedNotificationsDetailsNav.action',
            context.getGlobalDefinition('/SAPAssetManager/Globals/Features/NotificationHistories.global').getValue(),
            libTelemetry.PAGE_TYPE_DETAIL);
    } catch (error) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), 'RelatedNotificationsDetailsNav: ' + error);
    }
}
