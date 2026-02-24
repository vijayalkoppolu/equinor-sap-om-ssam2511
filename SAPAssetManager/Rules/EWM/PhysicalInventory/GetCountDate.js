/**
* @param {IClientAPI} clientAPI
* Returns the formatted count date and batch information based on the physical inventory status.
*/
import ODataDate from '../../Common/Date/ODataDate';
import { PhysicalInventoryStatus } from '../Common/EWMLibrary';
export default function GetCountDate(clientAPI) {
    const countDate = clientAPI.binding.CountDatePhysInv;
    let date = isCountedStatus(clientAPI) ? new ODataDate(countDate).toLocalDateString() : '';
    return date ? `${clientAPI.formatDatetime(date)},${clientAPI.binding.Batch}` : clientAPI.binding.Batch;
}

/**
 * Check if the PIStatus is 'COUN' or 'RECO'.
 * @param {IClientAPI} clientAPI
 * @returns {boolean} True if the status is 'COUN' or 'RECO' or 'POST', otherwise false.
 */
export function isCountedStatus(clientAPI) {
    const piStatus = clientAPI?.binding?.PIStatus ?? '';
    return piStatus === PhysicalInventoryStatus.Counted || piStatus === PhysicalInventoryStatus.Recounted || piStatus === PhysicalInventoryStatus.Posted;
}
