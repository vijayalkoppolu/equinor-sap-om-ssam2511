import { isCountedStatus } from  '../GetCountDate';
/**
* Set the Quantity to 0 if the status is not Counted
* @param {IClientAPI} clientAPI
*/
export default function IsQuantityZero(clientAPI) {
    return isCountedStatus(clientAPI) ? clientAPI.binding.Quantity : 0;
}
