import { WarehouseTaskStatus, WarehouseOrderStatus } from '../Common/EWMLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import { getWarehouseNo, getWarehouseOrder } from './GetReadLink';
/**
* Calculate the status of the warehouse order
* @param {context} context
*/
export default function GetWarehouseOrderStatus(context) {
    const warehouseNo = getWarehouseNo(context);
    const warehouseOrderValue = getWarehouseOrder(context);
    if (!warehouseNo || !warehouseOrderValue) {
        return '';
    }
    const query = `$filter=WarehouseNo eq '${warehouseNo}' and WarehouseOrder eq '${warehouseOrderValue}'&$expand=WarehouseTask_Nav`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseOrders', [], query).then(result => {
        if (!libVal.evalIsEmpty(result)) {
            const warehouseOrder = result.getItem(0);
            if (warehouseOrder.WarehouseTask_Nav) {
                const tasks = warehouseOrder.WarehouseTask_Nav.filter(task => task.WTStatus !== WarehouseTaskStatus.Confirmed);
                return libVal.evalIsEmpty(tasks) ? WarehouseOrderStatus.Confirmed : WarehouseOrderStatus.InProgess;
            }
            return warehouseOrder.WOStatus;
        }
        return WarehouseOrderStatus.Open;
    });
}
