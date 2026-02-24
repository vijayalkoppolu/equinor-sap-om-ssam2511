import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function PackedContainersDetailsPageNav(context) {
    const pageProxy = context.getPageProxy();
    return CommonLibrary.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/FL/PackContainers/FLPackedContainersCellOnPress.action', pageProxy.getActionBinding()['@odata.readLink'],'$expand=FldLogsCtnPkgPackingStatus_Nav, FldLogsPackCtnContainerItem_Nav, FldLogsPackCtnContainerPkg_Nav, FldLogsPackCtnContainerVyg_Nav, FldLogsPlant_Nav');
}
