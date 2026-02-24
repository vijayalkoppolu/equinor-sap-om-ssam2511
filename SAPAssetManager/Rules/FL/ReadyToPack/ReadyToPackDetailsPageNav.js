import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ReadyToPackDetailsPageNav(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    return CommonLibrary.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/FL/ReadyToPack/FLReadyToPackCellOnPress.action', pageProxy.getActionBinding()['@odata.readLink'],'$expand=FldLogsCtnPackageId_Nav, FldLogsOrderCategory_Nav, FldLogsPackCtnItemStatus_Nav, FldLogsPlant_Nav, FldLogsPackCtnRdyPckSrNo_Nav, FldLogsPackCtnVygStage_Nav');
}
