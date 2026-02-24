export default function OnlineSearchStockNav(clientAPI) {
    const container = clientAPI.getControls()[0];

    if (container?.searchString) {
        container.searchString = '';
    }

    return clientAPI.executeAction('/SAPAssetManager/Actions/Inventory/Stock/SearchStockOnlineNav.action');
}
