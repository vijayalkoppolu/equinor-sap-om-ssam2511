import libCom from '../../Common/Library/CommonLibrary';
/** @param {IClientAPI} context  */
export default function WOListDetailsQuery(context)  {
     const pageProxy = context.getPageProxy();
     if (context.searchString) {
       libCom.setStateVariable(context, 'searchString', context.searchString);
     } else {
       libCom.removeStateVariable(context, 'searchString');
     }
     pageProxy.executeAction('/SAPAssetManager/Actions/EWM/WarehouseOrders/WarehouseOrdersListViewNav.action');
}
