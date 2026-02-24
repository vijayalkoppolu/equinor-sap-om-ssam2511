import { ReadyToPackStatus } from '../Common/FLLibrary';
/**
* This function shows the accessory button for Ready to Pack.
* @param {IClientAPI} clientAPI
*/
export default function ShowAccessoryButton(clientAPI) {
if (clientAPI.binding.FldLogsShptItmStsCode === ReadyToPackStatus.Dispatched) {
    return ' ';
}
return "$(PLT, /SAPAssetManager/Images/edit-accessory.ios.png, /SAPAssetManager/Images/edit-accessory.android.png,'',/SAPAssetManager/Images/edit-accessory.ios.png)";
}
