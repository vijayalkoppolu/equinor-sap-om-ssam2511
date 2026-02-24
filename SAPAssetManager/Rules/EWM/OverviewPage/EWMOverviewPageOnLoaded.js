import { SaveTasksToPageData } from '../WarehouseTask/Details/TaskArray';

/**
* Handles the on loaded event of the overview page
* @param {IClientAPI} clientAPI
*/
export default function EWMOverviewPageOnLoaded(clientAPI) {
    SaveTasksToPageData(clientAPI.getPageProxy());
}
