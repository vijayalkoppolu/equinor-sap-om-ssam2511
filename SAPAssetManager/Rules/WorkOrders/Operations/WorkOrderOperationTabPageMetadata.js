import OverviewTabPageUpdate from '../../Common/TabPage/OverviewTabPageUpdate';

export default function WorkOrderOperationTabPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Operations/WorkOrderOperationsListView.page');
	return OverviewTabPageUpdate(context, page, '/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsFilter.action', 'MyWorkOrderOperation', '/SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderOperationsListViewGenerateCaption.js');
}
