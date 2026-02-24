import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function HUDelItemDetailsPageNav(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    return CommonLibrary.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/FL/HUDelItems/HUDelItemsDetailsPageNav.action', pageProxy.getActionBinding()['@odata.readLink'],'$expand=FldLogsHUDelItemStatus_Nav, FldLogsHandlingDecision_Nav, FldLogsPackagingType_Nav');
}
