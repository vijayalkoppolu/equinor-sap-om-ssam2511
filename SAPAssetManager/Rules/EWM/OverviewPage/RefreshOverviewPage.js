import { ResetTasksInPageData, SaveTasksToPageData } from '../WarehouseTask/Details/TaskArray';
import libCom from '../../Common/Library/CommonLibrary';   
/**
* Handle the refresh of the overview page
* @param {IClientAPI} clientAPI
*/
export default function RefreshOverviewPage(clientAPI) {
    libCom.removeStateVariable(clientAPI, 'WHTFailedItems'); 
    ResetTasksInPageData(clientAPI.getPageProxy());
    SaveTasksToPageData(clientAPI.getPageProxy());
}
