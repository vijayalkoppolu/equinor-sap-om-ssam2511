import { isTaskConfirmed } from '../../Common/EWMLibrary';
import libCom from '../../../Common/Library/CommonLibrary';
export default function WarehouseTaskConfirmationItem(context) {
    return getWarehouseTaskItem(context).then(warehouseTaskItem => {
        context.getPageProxy().getClientData().WarehouseTaskItem = warehouseTaskItem;
        return warehouseTaskItem;
    });
}

export function getWarehouseTaskItem(context) {
    const warehouseTask =  libCom.getStateVariable(context, 'WarehouseTask');
    return isTaskConfirmed(context,warehouseTask?.WarehouseTask).then(isConfirmed => {
        if (isConfirmed) {
            return fetchWarehouseTaskConfirmations(context,warehouseTask?.WarehouseTask).then(confirmations => {
                if (confirmations && confirmations.length > 0) {
                    return (parseInt(confirmations[0].WarehouseTaskItem, 10) + 1).toString().padStart(4, '0');
                } else {
                    return getNextItemNumber(context);
                }
            });
        } else {
            return getNextItemNumber(context);
        }
    }).catch(() => {
        return getNextItemNumber(context);
    });
}

function fetchWarehouseTaskConfirmations(context,warehouseTask = context.binding.WarehouseTask) {
    const service = '/SAPAssetManager/Services/AssetManager.service';
    const entitySet = 'WarehouseTasks';
    const queryOptions = `$top=1&$filter=WarehouseTask eq '${warehouseTask}'&$expand=WarehouseTaskConfirmation_Nav&$orderby=WarehouseTaskConfirmation_Nav/WarehouseTaskItem desc`;
    return context.read(service, entitySet, [], queryOptions).then(result => {
        return result.getItem(0).WarehouseTaskConfirmation_Nav;
    });
}

/**
 * Calculate the next item number for the Warehouse Task Confirmation
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @returns {Promise<string>}
 */
export function getNextItemNumber(context,warehouseTask = context.binding?.WarehouseTask) {
    const service = '/SAPAssetManager/Services/AssetManager.service';
    const entitySet = 'WarehouseTaskConfirmations';
    const queryOptions = `$select=WarehouseTaskItem&$filter=WarehouseTask eq '${warehouseTask}'&$orderby=WarehouseTaskItem desc`;
    return context.read(service, entitySet, [], queryOptions).then(result => {
        let resultItemNumber = '0001';
        if (result && result.length > 0) {
            const itemNumber = Number(result.getItem(0)?.WarehouseTaskItem);
            resultItemNumber = isNaN(itemNumber) ? resultItemNumber : (itemNumber + 1).toString().padStart(4, '0');
        }
        return resultItemNumber;
    });
}
