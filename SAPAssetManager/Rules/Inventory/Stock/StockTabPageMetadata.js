import OverviewTabPageUpdate from '../../Common/TabPage/OverviewTabPageUpdate';

export default function StockTabPageMetadata(context) {
	let page = context.getPageDefinition('/SAPAssetManager/Pages/Inventory/Stock/StockListView.page');
    return OverviewTabPageUpdate(context, page, '/SAPAssetManager/Rules/Inventory/Stock/BeforeStockSearchFilterNav.js', 'MaterialSLoc', '/SAPAssetManager/Rules/Inventory/Stock/StockTabPageCount.js');
}
