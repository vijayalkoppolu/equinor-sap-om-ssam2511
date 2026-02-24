/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import libCom from '../../Common/Library/CommonLibrary';
export default function EditFLDocumentNav(clientAPI) {
const binding = clientAPI.getPageProxy().getActionBinding();
libCom.setStateVariable(clientAPI, 'EntitySet', binding['@odata.readLink'].split('(')[0]);
libCom.setStateVariable(clientAPI, 'BulkFLUpdate', false);
return clientAPI.executeAction('/SAPAssetManager/Actions/FL/Edit/EditFLDocumentPageNav.action');
}
