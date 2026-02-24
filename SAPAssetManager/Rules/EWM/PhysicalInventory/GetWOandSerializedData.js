import libVal from '../../Common/Library/ValidationLibrary';

/**
* This function returns the Warehouse Order,batch and Serialized data for the Physical Inventory list item
* @param {IClientAPI} clientAPI
*/
export default function GetWOandSerializedData(clientAPI) {

    let returnValue = clientAPI.binding?.WarehouseOrder || '';

    if (!libVal.evalIsEmpty( clientAPI.binding?.Batch )) {
        returnValue += `, ${clientAPI.localizeText('batch')}`;
    }
    if (!libVal.evalIsEmpty( clientAPI.binding?.Serialized )) {
        returnValue += `, ${clientAPI.localizeText('pi_serialized')}`;
    }

    return returnValue;
}
