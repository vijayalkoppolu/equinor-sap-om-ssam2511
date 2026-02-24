import libCom from '../../../Common/Library/CommonLibrary';
/**
* Returns all items in the Bulk Update screen for FL Work Orders.
* @param {IClientAPI} clientAPI
*/

export default function ReturnAllItems(clientAPI) {
    libCom.removeStateVariable(clientAPI, 'BulkUpdateItem');
    libCom.removeStateVariable(clientAPI, 'BulkUpdateTotalItems');
    libCom.removeStateVariable(clientAPI, 'BulkUpdateItemSelectionMap');
    libCom.removeStateVariable(clientAPI, 'BulkUpdateFinalSave');  
    libCom.removeStateVariable(clientAPI, 'BulkFLSearch');
        const section = clientAPI.getPageProxy().getControls()[0].getSections()[0];
        const selectedItems = section.getSelectedItems().map(item => item.binding) || [];
        libCom.setStateVariable(clientAPI, 'SelectedFLWOItems', selectedItems);
    libCom.setStateVariable(clientAPI, 'BulkFLUpdateNav', clientAPI.getPageProxy().binding);
    return clientAPI.executeAction('/SAPAssetManager/Actions/FL/WorkOrders/BulkUpdate/FLBulkEditNav.action');
}
