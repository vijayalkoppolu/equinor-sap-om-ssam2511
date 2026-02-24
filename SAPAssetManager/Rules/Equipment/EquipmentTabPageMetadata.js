import OverviewTabPageUpdate from '../Common/TabPage/OverviewTabPageUpdate';

export default function EquipmentTabPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Equipment/EquipmentListView.page');
    return OverviewTabPageUpdate(clientAPI, 
        page, 
        '/SAPAssetManager/Actions/Equipment/EquipmentFilter.action', 
        'MyEquipment', 
        '/SAPAssetManager/Rules/Equipment/EquipmentTabPageCount.js');
}
