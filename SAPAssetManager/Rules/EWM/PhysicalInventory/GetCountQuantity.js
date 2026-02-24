import { isCountedStatus } from './GetCountDate';

/**
* Returns the count quantity with its unit of measure if the status is counted.
* @param {IClientAPI} clientAPI - The client API object containing binding data.
* @returns {string} The formatted quantity and unit of measure, or an empty string if not counted.
*/
export default function GetCountQuantity(clientAPI) {
    return isCountedStatus(clientAPI) && clientAPI.binding.Quantity && clientAPI.binding.UOM 
    ? `${clientAPI.binding.Quantity} ${clientAPI.binding.UOM}` 
    : '';
}
