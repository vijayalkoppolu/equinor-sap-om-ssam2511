import CommonLibrary from '../Common/Library/CommonLibrary';
import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function NotificationsListViewNav(context) {
    CommonLibrary.setStateVariable(context, 'OnFollowOnNotificationsList', false);
    return TelemetryLibrary.executeActionWithLogPageEvent(context,
        '/SAPAssetManager/Actions/Notifications/NotificationsListViewNav.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMNotifications.global').getValue(),
        TelemetryLibrary.PAGE_TYPE_LIST);
}
