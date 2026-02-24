import ODataLibrary from '../OData/ODataLibrary';
import Logger from '../Log/Logger';
import libNetwork from '../Common/Library/NetworkMonitoringLibrary';
import IsOnlineSearchEnabled from './IsOnlineSearchEnabled';

/**
 * Reads data from the online service based on the specified task
 * @param {*} context 
 * @param {string} task - The task to determine which online request to execute
 * @param {boolean} [showActivity=true] - Whether to show an activity indicator during the request
 * @return {Promise<Array>} - Returns a promise that resolves to the rows read from the online service
 * @throws {Error} - Throws an error if the task is not supported or if there is an issue with the online request
 */
export default async function ExecuteOnlineRequest(context, task, showActivity=true) {
    try {
        if (libNetwork.isNetworkConnected(context) && IsOnlineSearchEnabled(context)) {
            let target = context;
            let query, entitySet, binding;

            if (context.getPageProxy) {
                target = context.getPageProxy();
            }
            binding = target.getActionBinding();

            if (showActivity) target.showActivityIndicator(context.localizeText('online_request_initiated'));

            switch (task) {
                case 'WorkOrderHistorySingleton':
                    query = `$filter=OrderId eq '${binding.OrderId}'`;
                    entitySet = 'WorkOrderHeaders';
                    break;
                case 'NotificationHistorySingleton':
                    query = `$filter=NotificationNumber eq '${binding.NotificationNumber}'`;
                    entitySet = 'NotificationHeaders';
                    break;
                default:
                    throw new Error(`Task '${task}' is not supported.`);
            }

            //Read using the online service for the specified query and entity
            await ODataLibrary.initializeOnlineService(context);
            let rows = await context.read('/SAPAssetManager/Services/OnlineAssetManager.service', entitySet, [], query);
            if (showActivity) target.dismissActivityIndicator();
            return rows;
        }
        return ''; // Return empty result if not connected to network or feature disabled
    } catch (error) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOnlineQuery.global').getValue(), 'ExecuteOnlineRequest: ' + error);
        if (showActivity) context.dismissActivityIndicator();
        return context.executeAction('/SAPAssetManager/Actions/OnlineSearch/OnlineRequestErrorToast.action');
    }  
}
