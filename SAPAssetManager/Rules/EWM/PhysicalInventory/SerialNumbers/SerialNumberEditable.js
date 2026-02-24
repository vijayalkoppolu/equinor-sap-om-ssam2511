import { GetQuantityAndSerialNumbers } from  '../Count/ScanCaption';
/**
* This function returns true if the serial number is editable
* @param {IClientAPI} clientAPI
*/
export default function SerialNumberEditable(clientAPI) {
    const { quantity, length } = GetQuantityAndSerialNumbers(clientAPI);
    return length < quantity;
}
