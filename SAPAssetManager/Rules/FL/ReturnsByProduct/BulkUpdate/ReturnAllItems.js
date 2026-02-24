import libCom from '../../../Common/Library/CommonLibrary';
/**
* Returns all items in the Bulk Update screen for FL Work Orders.
* @param {IClientAPI} clientAPI
*/
import IsInitiateReturn from '../../Common/IsInitiateReturn';
export default function ReturnAllItems(clientAPI) {
    libCom.removeStateVariable(clientAPI, 'BulkUpdateItem');
    libCom.removeStateVariable(clientAPI, 'BulkUpdateTotalItems');
    libCom.removeStateVariable(clientAPI, 'BulkUpdateItemSelectionMap');
    libCom.removeStateVariable(clientAPI, 'BulkUpdateFinalSave');
    libCom.removeStateVariable(clientAPI, 'BulkFLSearch');
    const section = clientAPI.getPageProxy().getControls()[0].getSections()[0];
    const selectedItems = section.getSelectedItems().map(item => item.binding) || [];
    libCom.setStateVariable(clientAPI, 'SelectedFLPItems', selectedItems);
    libCom.setStateVariable(clientAPI, 'BulkFLUpdateNav', clientAPI.getPageProxy().binding);
    let input = clientAPI.getPageProxy().getControl('SectionedTable').filters[0].filterItems[0];
    let match = input.match(/'(\d+)'/);
    
    if (IsInitiateReturn(match[1])) {
        libCom.setStateVariable(clientAPI, 'IsInitiateReturn', true);

    } else {
        libCom.setStateVariable(clientAPI, 'IsInitiateReturn', false);
    }

    return clientAPI.executeAction('/SAPAssetManager/Actions/FL/ReturnsByProduct/BulkUpdate/FLPBulkEditNav.action');
}
