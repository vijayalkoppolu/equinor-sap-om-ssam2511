/**
* Get the quantity from the binding
* @param {IClientAPI} clientAPI
*/
export default function Quantity(clientAPI) {
    return clientAPI.binding.Quantity || 0;
}
