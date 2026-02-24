
import libTelemetry from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function RelatedNotificationsListViewNav(context) {
    return libTelemetry.executeActionWithLogPageEvent(context,
        '/SAPAssetManager/Actions/Notifications/RelatedNotifications/RelatedNotificationsListViewNav.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/NotificationHistories.global').getValue(),
        libTelemetry.PAGE_TYPE_LIST);
}
