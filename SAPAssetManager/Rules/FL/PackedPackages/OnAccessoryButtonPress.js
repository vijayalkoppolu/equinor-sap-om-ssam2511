import CommonLibrary from '../../Common/Library/CommonLibrary';
import { PackedPackagesTransStatus } from '../Common/FLLibrary';
/**
* This function handles the button press for the Ready to Pack accessory.
* @param {IClientAPI} clientAPI
*/

export default function OnAccessoryButtonPress(clientAPI) {
   if (clientAPI.binding.FldLogsCtnPackgStsCode === PackedPackagesTransStatus.Dispatched) {
       return ' ';
   }
   return CommonLibrary.navigateOnRead(clientAPI, '/SAPAssetManager/Actions/FL/PackedPackages/FLPackedPackageEditNav.action', clientAPI.binding['@odata.readLink'], '');
}
