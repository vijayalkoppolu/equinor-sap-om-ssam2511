export default function FLWorkOrderDetailFilterNav(clientAPI) {
    var selectedTab = clientAPI.getControl('TabsControl').getSelectedTabItemName();
    if (selectedTab === 'Products') {
        return clientAPI.executeAction('/SAPAssetManager/Actions/FL/WorkOrders/FLProductsFilter.action');
    } else {
        return clientAPI.executeAction('/SAPAssetManager/Actions/FL/WorkOrders/FLResvItemFilter.action');
    }
}
