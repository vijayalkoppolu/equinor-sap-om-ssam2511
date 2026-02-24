import MobileStatusCompleted from '../../MobileStatus/MobileStatusCompleted';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import { GlobalVar as globals } from '../../Common/Library/GlobalCommon';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import ODataLibrary from '../../OData/ODataLibrary';

/**
* Disable creating confirmations if order:
    has completed status or
    in created state or
    auto release if off or 
    WO is local and EnableOnLocalBusinessObjects is off
*/
export default function ConfirmationCreateIsEnabledForWO(context) {
    const completedStatus = MobileStatusCompleted(context);
    const mobileStatus = libMobile.getMobileStatus(context.binding, context);
    const isAutoReleaseOn = globals.getAppParam().WORKORDER.AutoRelease === 'Y';
    const isEnabledOnLocal = globals.getAppParam().MOBILESTATUS.EnableOnLocalBusinessObjects === 'Y';
    const isNotCompleted = mobileStatus !== completedStatus;
    const isNotInCreatedState = !(libWO.isWorkOrderInCreatedState(context));
    const isLocal = ODataLibrary.isLocal(context.binding);
    
    if (isLocal) {
        return isNotCompleted && isAutoReleaseOn && isNotInCreatedState && isEnabledOnLocal;
    } else {
        return isNotCompleted && isNotInCreatedState;
    }
}
