import { isTaskWithSerialNumbers } from '../../Common/EWMLibrary';
/**
 * Show/ide button based on the visibility of the serial numbers
 * @param {IClientAPI} context 
 */
export default function IsVisibleSerialNumberButtonLocalConfirmation(context) {
    return isTaskWithSerialNumbers(context, context.binding.WarehouseTask_Nav);
}
