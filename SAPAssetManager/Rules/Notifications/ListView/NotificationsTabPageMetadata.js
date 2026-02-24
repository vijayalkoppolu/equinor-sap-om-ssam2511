import OverviewTabPageUpdate from '../../Common/TabPage/OverviewTabPageUpdate';

export default function NotificationsTabPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Notifications/NotificationsListView.page');
    return OverviewTabPageUpdate(context, page, '/SAPAssetManager/Actions/Notifications/NotificationFilter.action', 'MyNotificationHeader', '/SAPAssetManager/Rules/Notifications/ListView/NotificationListSetCaption.js');
}
