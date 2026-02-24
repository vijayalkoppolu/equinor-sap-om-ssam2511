/**
* Bind FL Order Details Page
* @param {IClientAPI} clientAPI
*/

import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function FLWODetailPageNav(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    return CommonLibrary.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/FL/WorkOrders/FLWorkOrderDetailPageNav.action', pageProxy.getActionBinding()['@odata.readLink'],'$expand=FldLogsWoProduct_Nav, FldLogsWoResvItem_Nav');
}

