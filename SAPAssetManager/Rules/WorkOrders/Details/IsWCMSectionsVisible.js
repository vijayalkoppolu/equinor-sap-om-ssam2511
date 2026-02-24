import { WorkOrderLibrary as libWO } from '../WorkOrderLibrary';
import WCMWorkApprovalsVisible from '../../WCM/Common/WCMWorkApprovalsVisible';
import IsWCMWorkPermitEnabled from '../../UserFeatures/IsWCMWorkPermitEnabled';

export default function IsWCMSectionsVisible(context) {
    const pageProxy = context.getPageProxy();

    if (libWO.isWCMWorkOrder(pageProxy)) {
        switch (context.getName()) {
            case 'WorkApprovals':
                return WCMWorkApprovalsVisible(pageProxy);
            case 'WorkPermitsListSection':
                return IsWCMWorkPermitEnabled(pageProxy);
        }
    }

    return false;
}
