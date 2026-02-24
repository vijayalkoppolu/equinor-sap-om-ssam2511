/**
* Set the search string and navigate to the detail list view
* @param {IClientAPI} clientAPI
*/
import libCom from '../../Common/Library/CommonLibrary';
/**
 * Navigate to the Physical Inventory List View
 * @param {IClientAPI} context 
 * @returns 
 */
export default function WHPhyInvListDetailsQuery(context) {
    const pageProxy = context.getPageProxy();
     if (context.searchString) {
       libCom.setStateVariable(context, 'searchString', context.searchString);
     } else {
       libCom.removeStateVariable(context, 'searchString');
     }
     return pageProxy.executeAction('/SAPAssetManager/Actions/EWM/PhysicalInventory/PhysicalInvListViewNav.action');
}
