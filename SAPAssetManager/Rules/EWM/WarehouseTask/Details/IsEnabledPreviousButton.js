import { IsFirst } from './TaskArray';
import { openItems , confirmedItems , filterFlag} from '../ListView/WarehouseTaskListQuery';
/**
 * 
 * @param {IClientAPI} context 
 */
export default function IsEnabledPreviousButton(context) {
    const WHTaskId = context.binding.WarehouseTask;
    if (filterFlag[0] === 'Open') {
        const openItemsIds = openItems.map(item => item.WarehouseTask);
        const currentIndex = openItemsIds.indexOf(WHTaskId);
        return currentIndex>0;
    } else if (filterFlag[0] === 'Confirmed') {
        const confirmItemsIds = confirmedItems.map(item => item.WarehouseTask);
        const currentIndex = confirmItemsIds.indexOf(WHTaskId);
        return currentIndex>0;
    } else {
        return !IsFirst(context, WHTaskId);
    }
    
}
