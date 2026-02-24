
import CommonLibrary from '../../../../Common/Library/CommonLibrary';

export default function OnResvItemButtonPress(clientAPI) {
    CommonLibrary.setStateVariable(clientAPI, 'BulkFLUpdateNav',false);
    return CommonLibrary.navigateOnRead(clientAPI, '/SAPAssetManager/Actions/FL/WorkOrders/FLResvItemDetailViewNav.action', clientAPI.binding['@odata.readLink'],'');
}
