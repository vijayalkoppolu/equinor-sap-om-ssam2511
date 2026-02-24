import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function PackageItemDetailsPageNav(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const actionBinding = pageProxy.getActionBinding();
    return CommonLibrary.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/FL/Packages/PackageItemsDetailsPageNav.action', actionBinding['@odata.readLink'], '$expand=FldLogsContainerItemStatus_Nav, FldLogsHandlingDecision_Nav, FldLogsPackagingType_Nav, FldLogsVisualInspection_Nav');
}
