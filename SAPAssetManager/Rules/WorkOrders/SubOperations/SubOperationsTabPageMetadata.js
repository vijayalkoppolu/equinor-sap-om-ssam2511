import OverviewTabPageUpdate from '../../Common/TabPage/OverviewTabPageUpdate';

export default function SubOperationsTabPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/SubOperation/SubOperationsListView.page');
    return OverviewTabPageUpdate(context, page, '/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationsFilter.action', 'MyWorkOrderSubOperation', '/SAPAssetManager/Rules/WorkOrders/SubOperations/SubOperationsListViewCaption.js');
}
