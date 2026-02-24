import CommonLibrary from '../../Common/Library/CommonLibrary';
import { ReadyToPackStatus } from '../Common/FLLibrary';
/**
* This function handles the button press for the Ready to Pack accessory.
* @param {IClientAPI} clientAPI
*/

export default function ReadyToPackAccessoryButtonPress(clientAPI) {
   if (clientAPI.binding.FldLogsShptItmStsCode === ReadyToPackStatus.Dispatched) {
       return ' ';
   }
   return CommonLibrary.navigateOnRead(clientAPI, '/SAPAssetManager/Actions/FL/ReadyToPack/FLReadyToPackEditNav.action', clientAPI.binding['@odata.readLink'], '');
}
