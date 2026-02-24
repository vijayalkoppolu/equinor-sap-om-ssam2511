/**
* This function is called when the user taps on the Edit All button in the Packed Containers list view.
* @param {IClientAPI} clientAPI
*/
import libCom from '../../../Common/Library/CommonLibrary';
export default function EditAllItems(clientAPI) {
    libCom.removeStateVariable(clientAPI, 'BulkUpdateItem');
    libCom.removeStateVariable(clientAPI, 'BulkUpdateTotalItems');
    libCom.removeStateVariable(clientAPI, 'BulkUpdateItemSelectionMap');
    libCom.removeStateVariable(clientAPI, 'BulkUpdateFinalSave');  
    libCom.removeStateVariable(clientAPI, 'BulkFLSearch');
    libCom.setStateVariable(clientAPI, 'BulkFLUpdateNav', clientAPI.getPageProxy().binding);
    const section = clientAPI.getPageProxy().getControls()[0].getSections()[0];
    const selectedItems = section.getSelectedItems().map(item => item.binding) || [];
    libCom.setStateVariable(clientAPI, 'SelectedPackedContItems', selectedItems);
    return clientAPI.executeAction('/SAPAssetManager/Actions/FL/PackContainers/FLPackContainerBulkEditNav.action');
}
