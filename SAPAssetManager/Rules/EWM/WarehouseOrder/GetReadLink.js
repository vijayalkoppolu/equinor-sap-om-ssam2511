import CommonLibrary from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function GetReadLink(clientAPI) {
    const warehouseNo = getWarehouseNo(clientAPI);
    const warehouseOrder = getWarehouseOrder(clientAPI);
    
    const query = `$filter=WarehouseNo eq '${warehouseNo}' and WarehouseOrder eq '${warehouseOrder}'`;

    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseOrders', [], query).then(function(result) {
        if (!libVal.evalIsEmpty(result)) {
            let wo = result.getItem(0);
            return wo['@odata.readLink'];
        }
        return '';
    });
}
/**
 * Get the warehouse number from the state variable or binding.
 * @param {IClientAPI} clientAPI
 * @returns {string} The warehouse number.
 */
export function getWarehouseNo(clientAPI) {
    return CommonLibrary.getStateVariable(clientAPI, 'WarehouseTask')
        ? CommonLibrary.getStateVariable(clientAPI, 'WarehouseTask').WarehouseNo
        : clientAPI?.binding?.WarehouseNo ?? CommonLibrary.getStateVariable(clientAPI, 'WarehouseNoForTaskConfirmation');
}

/**
 * Get the warehouse order from the state variable or binding.
 * @param {IClientAPI} clientAPI
 * @returns {string} The warehouse order.
 */
export function getWarehouseOrder(clientAPI) {
    return CommonLibrary.getStateVariable(clientAPI, 'WarehouseTask')
        ? CommonLibrary.getStateVariable(clientAPI, 'WarehouseTask').WarehouseOrder
        : clientAPI?.binding?.WarehouseOrder ?? CommonLibrary.getStateVariable(clientAPI, 'WarehouseOrderForTaskConfirmation');
}
