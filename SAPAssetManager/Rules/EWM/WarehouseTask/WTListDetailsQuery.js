/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import libCom from '../../Common/Library/CommonLibrary';
export default function WTListDetailsQuery(context) {
    const pageProxy = context.getPageProxy();
    if (context.searchString) {
      libCom.setStateVariable(context, 'searchString', context.searchString);
    } else {
      libCom.removeStateVariable(context, 'searchString');
    }
    pageProxy.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/WarehouseOrdersListViewNav.action');
}
