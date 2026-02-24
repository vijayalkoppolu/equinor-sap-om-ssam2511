import CommonLibrary from '../../../../Common/Library/CommonLibrary';

export default function FLProductDetailsPageNav(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    return CommonLibrary.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/FL/Products/FLProductDetailsPageNav.action', pageProxy.getActionBinding()['@odata.readLink'], '');
}

