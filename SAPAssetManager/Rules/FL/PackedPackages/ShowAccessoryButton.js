import { PackedPackagesTransStatus } from '../Common/FLLibrary';
/**
* This function shows the accessory button for Ready to Pack.
* @param {IClientAPI} clientAPI
*/
export default function ShowAccessoryButton(clientAPI) {
    if (clientAPI.binding.FldLogsCtnIntTranspStsCode === PackedPackagesTransStatus.Dispatched) {
        return null;
    }
return 'sap-icon://write-new';
}
