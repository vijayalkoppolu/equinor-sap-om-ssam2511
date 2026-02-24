import Logger from '../../Log/Logger';
import WorkOrdersListViewQueryOption from '../ListView/WorkOrdersListViewQueryOption';
import WorkOrderDetailsNav from '../WorkOrderDetailsNav';
import ExecuteOnlineRequest from '../../OnlineSearch/ExecuteOnlineRequest';

/**
 * Navigate to the work order history record:
 * First try to find the work order on the device and navigate to order details
 * If not found, then check online service for the header record and navigate to online details
 * Otherwise rebind the history record data and navigate to history details
 * @param {*} context
 * @param {boolean} [historyOnly=false] - If true, only navigate to history details without checking for device or online records
 * @returns 
 */
export default async function WorkOrderHistoryDetailsNav(context, historyOnly=false) {
    try {
        let target = context;

        if (context.getPageProxy) {
            target = context.getPageProxy();
        }
        if (!historyOnly) {
            let queryBuilder = await WorkOrdersListViewQueryOption(context, 'RelatedWorkOrder');
            let query = await queryBuilder.build();
            let row = await context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], query); //Check for work order

            if (row && row.length > 0) { //Work order exists on device, so navigate to full record
                target.setActionBinding(row.getItem(0));
                return WorkOrderDetailsNav(target);
            }

            //If the work order does not exist on device, then check online service for header record and navigate to online details
            let onlineResult = await ExecuteOnlineRequest(context, 'WorkOrderHistorySingleton'); //Read the history record from the online service
            if (onlineResult && onlineResult.length > 0) {
                target.setActionBinding(onlineResult.getItem(0)); //Set the action binding to the online work order
                return target.executeAction('/SAPAssetManager/Actions/WorkOrders/OnlineWorkOrderDetailsNav.action');
            }
        }
        //Rebind the necessary history record data selected from the list and navigate to history details
        let result = await context.read('/SAPAssetManager/Services/AssetManager.service', target.getActionBinding()['@odata.readLink'], [], '$expand=HistoryPriority');
        target.setActionBinding(result.getItem(0));
        return target.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderHistoryDetailsNav.action');
    } catch (error) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), 'WorkOrderHistoryDetailsNav: ' + error);
    }
}
