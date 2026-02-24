import libCom from '../../../Common/Library/CommonLibrary';
import { EWM_WT_ITEM_CURRENT } from '../SerialNumber/SerialNumberLib';

/**
 * Get Serial Number status text
 * @param {IClientAPI} context 
 * @returns 
 */
export default function SerialNumberStatusText(context) {
    const currentTaskItem = libCom.getStateVariable(context, EWM_WT_ITEM_CURRENT);
    const usedInOtherConfirmation = context.binding.usedInOtherConfirmation;
    if (usedInOtherConfirmation) {
        return `${usedInOtherConfirmation.WarehouseTask}/${usedInOtherConfirmation.WarehouseTaskItem}`;
    } else if (context.binding.selected) {
        return `${context.binding.entry.WarehouseTask}/${currentTaskItem}`;
    }
    return '';
}
