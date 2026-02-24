import FLDocumentUpdate from './FLDocumentUpdate';
import libCom from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function FLUpdateItem(clientAPI) {
    libCom.setStateVariable(clientAPI, 'BulkFLUpdate', false);
    return FLDocumentUpdate(clientAPI);
}
