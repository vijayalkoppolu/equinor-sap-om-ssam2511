import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';

/**
* This function will configure the query options for the material entity sets.
* Goods Receipt will use MaterialBatches which requires Plant and Material
* Goods Issue will use MaterialBatchStockSet which requires Plant, StorageLocation and Material
* @param {IClientAPI} context
*/
export default function BatchListPickerQueryOptions(context) {

    let queryPlant = libCom.getStateVariable(context, 'MaterialPlantValue');
    let querySLoc = libCom.getStateVariable(context, 'MaterialSLocValue');
    let movementType = libCom.getStateVariable(context, 'IMMovementType');
    let qb = context.dataQueryBuilder();

    if (!libVal.evalIsEmpty(context.binding) && !queryPlant) {
        const type = context.binding['@odata.type']?.substring('#sap_mobile.'.length);
        if (type === 'ReservationItem') {
            queryPlant = context.binding.SupplyPlant;
            if (!querySLoc) {
                querySLoc = context.binding.SupplyStorageLocation;
            }
        }
    }

    if (!queryPlant) {
        queryPlant = context.binding?.Plant || libCom.getUserDefaultPlant();
    }
    if (!querySLoc) {
        querySLoc = context.binding?.StorageLocation || libCom.getUserDefaultStorageLocation();
    }

    let queryMaterial = extractMaterial(context.binding);

    let searchString = context.searchString;
    if (searchString) {
        searchString = searchString.toLowerCase();
        qb.filter(`substringof('${searchString}', tolower(Batch))`);
    }

    if (movementType === 'I') {
        qb.filter(`MaterialNum eq '${queryMaterial}' and Plant eq '${queryPlant}' and StorageLocation eq '${querySLoc}'`);
    } else {
        qb.filter(`MaterialNum eq '${queryMaterial}' and Plant eq '${queryPlant}'`);
    }
    return qb;
}

function extractMaterial(binding) {
    if (!binding) {
        return '';
    }
    if (binding.MaterialNum && typeof binding.MaterialNum === 'string') {
        return binding.MaterialNum;
    }
    if (binding.Material && typeof binding.Material === 'string') {
        return binding.Material;
    }
    if (binding.Material && typeof binding.Material === 'object') {
        if (typeof binding.Material.MaterialNum === 'string') {
            return binding.Material.MaterialNum;
        }
        if (typeof binding.Material.Material === 'string') {
            return binding.Material.Material;
        }
    }
    return '';
}
