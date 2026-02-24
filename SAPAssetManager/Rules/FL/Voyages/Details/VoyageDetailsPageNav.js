import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function VoyageDetailsPageNav(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    return CommonLibrary.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/FL/Voyages/VoyageDetailsPageNav.action', pageProxy.getActionBinding()['@odata.readLink'],'$expand=FldLogsVoyageStatus_Nav, FldLogsVoyageType_Nav');
}
