
import libCommon from '../../Common/Library/CommonLibrary';
import WorkOrderMobileStatusLibrary from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import ODataLibrary from '../../OData/ODataLibrary';

export default async function PartDetailsAddButtonVisible(pageClientAPI) {
    let isWOCompleted = await WorkOrderMobileStatusLibrary.isOrderComplete(pageClientAPI);
    let isWOEditEnabled = libCommon.getAppParam(pageClientAPI, 'USER_AUTHORIZATIONS', 'Enable.WO.Edit') === 'Y';
    
    return isWOEditEnabled && !ODataLibrary.isLocal(pageClientAPI.binding) && !isWOCompleted;
}
