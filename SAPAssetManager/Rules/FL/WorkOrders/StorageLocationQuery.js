import libCom from '../../Common/Library/CommonLibrary';
/**
* StorageLocationQuery
* Returns a filter for storage locations based on the plant.
* @param {IClientAPI} clientAPI
*/
export default function StorageLocationQuery(clientAPI) {
    const plant = clientAPI.binding.plant || libCom.getUserDefaultPlant();
    return "$filter=Plant eq '" + plant + "'&$orderby=StorageLocation";
}
