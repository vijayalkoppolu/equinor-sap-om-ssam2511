import { WarehouseTaskStatus, isTaskConfirmed, GetConfirmedAndTotalQuantity } from '../Common/EWMLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
 * Flip the warehouse task status
 * @param {IClientAPI} context
 */
export default function WarehouseTaskWTStatus(context) {

    if (CommonLibrary.getStateVariable(context, 'WarehouseTask') || CommonLibrary.getStateVariable(context, 'ExceptionDiffCase')) {
        return WarehouseTaskStatus.Confirmed;
    }
    
    const warehouseTask = context.binding?.WarehouseTask ?? CommonLibrary.getStateVariable(context, 'WarehouseTaskValue');
    return isTaskConfirmed(context, warehouseTask).then(isConfirmed => {
        if (!isConfirmed || context.binding?.['@odata.type'] === '#sap_mobile.WarehouseTaskConfirmation') {
            return WarehouseTaskStatus.Open;
        }
        return GetConfirmedAndTotalQuantity(context).then(({ confirmedQuantity, totalQuantity }) => {
            if (!isNaN(totalQuantity)) {
                const remainingQuantity = totalQuantity - confirmedQuantity;
                return remainingQuantity === 0 ? WarehouseTaskStatus.Confirmed : WarehouseTaskStatus.Open;
            } else {
                return WarehouseTaskStatus.Confirmed;
            }
        });
    }).catch(() => {
        return WarehouseTaskStatus.Open;
    });
}
