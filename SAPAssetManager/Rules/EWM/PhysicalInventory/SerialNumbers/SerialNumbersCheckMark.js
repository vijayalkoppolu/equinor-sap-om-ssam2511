/**
* This function returns the checkmark icon if the serial number is selected
* @param {IClientAPI} clientAPI
*/
export default function SerialNumbersCheckMark(clientAPI) {
    return clientAPI.binding.Selected ? 'checkmark' : '';
}
