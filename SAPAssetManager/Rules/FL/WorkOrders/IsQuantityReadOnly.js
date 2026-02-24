import {FLEntityNames} from '../Common/FLLibrary';
/**
* Checks if the quantity field is read-only for FL Work Orders.
* @param {IClientAPI} clientAPI
*/
export default function IsQuantityReadOnly(clientAPI) {
const type = clientAPI.binding['@odata.type'].substring('#sap_mobile.'.length);
return type === FLEntityNames.WoProduct;
}

