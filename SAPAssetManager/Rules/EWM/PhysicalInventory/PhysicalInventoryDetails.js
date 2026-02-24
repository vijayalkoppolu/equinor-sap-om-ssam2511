/**
* This function returns the Physical Inventory Document Number and the Item Number
* @param {IClientAPI} clientAPI
*/
export default function PhysicalInventoryDetails(clientAPI) {
const item = clientAPI.binding?.ITEM_NO?.replace(/^0+/, '');//removes leading zeros
return `${clientAPI.binding?.PIDocumentNo}/${item}`;
}
