import { isTaskWithSerialNumbers } from '../../Common/EWMLibrary';
/**
 * Show/ide button based on the visibility of the serial numbers
 * @param {IClientAPI} context 
 */
export default function IsVisibleSerialNumberButton(context) {
    return isTaskWithSerialNumbers(context);
}
