/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import { isCountedStatus } from './GetCountDate';
export default function GetCountStatus(clientAPI) {
   return isCountedStatus(clientAPI) ? clientAPI.localizeText('counted') : clientAPI.localizeText('pi_uncounted');
}
