/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import libCom from '../../Common/Library/CommonLibrary';
export default function EditAllItems(clientAPI) {
    libCom.removeStateVariable(clientAPI, 'BulkUpdateItem');
    libCom.removeStateVariable(clientAPI, 'BulkUpdateTotalItems');
    libCom.removeStateVariable(clientAPI, 'BulkUpdateItemSelectionMap');
    libCom.removeStateVariable(clientAPI, 'BulkUpdateFinalSave');  
    libCom.removeStateVariable(clientAPI, 'BulkFLSearch');
    libCom.setStateVariable(clientAPI, 'BulkFLUpdateNav', clientAPI.getPageProxy().binding);
    return clientAPI.executeAction('/SAPAssetManager/Actions/FL/Edit/BulkEditNav.action');
}
