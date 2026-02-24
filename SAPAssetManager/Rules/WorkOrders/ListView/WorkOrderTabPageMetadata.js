import OverviewTabPageUpdate from '../../Common/TabPage/OverviewTabPageUpdate';
export default function WorkOrderTabPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/WorkOrdersListView.page');
	return OverviewTabPageUpdate(context, page, '/SAPAssetManager/Actions/WorkOrders/WorkOrderFilter.action', 'MyWorkOrderHeader', '/SAPAssetManager/Rules/WorkOrders/WorkOrderListViewCaption.js');
}
