import { SaveTasksToPageData } from '../WarehouseTask/Details/TaskArray';

/**
* Handles the on resume event of the overview page
* @param {IClientAPI} clientAPI
*/
export default function EWMOverviewPageOnResume(clientAPI) {
    // Set Task's array to handle Prev/Next navigation
    SaveTasksToPageData(clientAPI.getPageProxy());
}
