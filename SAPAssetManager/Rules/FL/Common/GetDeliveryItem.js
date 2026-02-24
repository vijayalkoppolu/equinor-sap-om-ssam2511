/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function GetDeliveryItem(clientAPI) {
    return [clientAPI.binding.DeliveryDocument, clientAPI.binding.DeliveryDocumentItem].filter(i => !!i).join('/');
}
