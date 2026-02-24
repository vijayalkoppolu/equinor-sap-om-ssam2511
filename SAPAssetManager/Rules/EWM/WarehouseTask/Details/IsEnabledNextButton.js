import { IsLast } from './TaskArray';
import { openItems , confirmedItems , filterFlag } from '../ListView/WarehouseTaskListQuery';
/**
 * 
 * @param {IClientAPI} context 
 */
export default function IsEnabledNextButton(context) {
    const WHTaskId = context.binding.WarehouseTask;
    if (filterFlag[0] === 'Open') {
        const openItemsIds = openItems.map(item => item.WarehouseTask);
        const currentIndex = openItemsIds.indexOf(WHTaskId);
        return currentIndex !== -1 && currentIndex < openItemsIds.length - 1;
    } else if (filterFlag[0] === 'Confirmed') {
        const confirmItemsIds = confirmedItems.map(item => item.WarehouseTask);
        const currentIndex = confirmItemsIds.indexOf(WHTaskId);
        return currentIndex !== -1 && currentIndex < confirmItemsIds.length - 1;
    } else {
        return !IsLast(context, WHTaskId);
    }
}
