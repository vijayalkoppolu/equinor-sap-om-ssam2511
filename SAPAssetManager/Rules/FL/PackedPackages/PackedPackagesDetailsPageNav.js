import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function PackedPackagesDetailsPageNav(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    return CommonLibrary.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/FL/PackedPackages/FLPackedPackagesCellOnPress.action', pageProxy.getActionBinding()['@odata.readLink'],'$expand=FldLogsCtnPackageId_Nav, FldLogsCtnPkgPackingStatus_Nav, FldLogsPackCtnPkgItem_Nav, FldLogsPackCtnPkgVyg_Nav, FldLogsPlant_Nav');
}
