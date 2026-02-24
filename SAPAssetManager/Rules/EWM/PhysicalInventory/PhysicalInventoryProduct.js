/**
* Get the product ID and description for a physical inventory item
* @param {IClientAPI} clientAPI
*/
export default function PhysicalInventoryProduct(clientAPI) {
    return `${clientAPI.binding.ProductID} - ${clientAPI.binding.ProductDescription}`;
}
