/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function GetPO(clientAPI) {
    return clientAPI.binding.PurOrder ? `${clientAPI.binding.PurOrder}/${clientAPI.binding.POItem}` : '-';
}
