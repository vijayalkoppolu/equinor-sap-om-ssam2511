import CommonLibrary from '../../Common/Library/CommonLibrary';

export default async function ContainerItemDetailsPageNav(clientAPI) {
    let pageProxy = clientAPI.getPageProxy();
    let actionBinding = pageProxy.getActionBinding();
    return CommonLibrary.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/FL/Containers/ContainerItemsDetailsPageNav.action', actionBinding['@odata.readLink'], '$expand=FldLogsContainerItemStatus_Nav, FldLogsHandlingDecision_Nav, FldLogsPackagingType_Nav, FldLogsVisualInspection_Nav');
}
