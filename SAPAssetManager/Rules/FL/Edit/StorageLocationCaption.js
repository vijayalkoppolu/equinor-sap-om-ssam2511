/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import libCom from '../../Common/Library/CommonLibrary';
export default function StorageLocationCaption(clientAPI) {
    return libCom.formatCaptionWithRequiredSign(clientAPI, 'destination_storage_location', true);
}
