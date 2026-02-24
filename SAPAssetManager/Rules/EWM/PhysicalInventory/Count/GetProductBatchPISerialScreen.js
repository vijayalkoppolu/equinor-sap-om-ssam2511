/**
* Get the product id and the batch of the Physical inventory document.
* @param {IClientAPI} clientAPI
*/
export default function GetProductBatchPISerialScreen(clientAPI) {
    return `${clientAPI.binding.ProductID}/${clientAPI.binding.Batch}`;
}
