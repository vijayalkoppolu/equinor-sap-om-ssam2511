import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function FLPProductDetailsPageNav(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    return CommonLibrary.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/FL/ReturnsByProduct/FLPProductDetailsPageNav.action', pageProxy.getActionBinding()['@odata.readLink'], '$expand=FldLogsRecommendedAction_Nav, FldLogsReturnStatus_Nav, FldLogsSupproc_Nav, FldLogsRefDocType_Nav, FldLogsShippingPoint_Nav');
}

