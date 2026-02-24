import libMobile from '../../MobileStatus/MobileStatusLibrary';
import common from '../Library/CommonLibrary';
import { WorkOrderDetailsPageName } from '../../WorkOrders/Details/WorkOrderDetailsPageToOpen';
import { ServiceOrderDetailsPageName } from '../../ServiceOrders/ServiceOrderDetailsPageToOpen';
import { ServiceRequestDetailsPageName } from '../../ServiceOrders/ServiceRequests/Details/ServiceRequestDetailsPageToOpen';

export default function IsBusinessObjectChangeable(context) {
    const pageName = common.getPageName(context);

    switch (pageName) {
        case WorkOrderDetailsPageName(context):
            return libMobile.isHeaderStatusChangeable(context);
        case ServiceOrderDetailsPageName(context):
        case ServiceRequestDetailsPageName(context):
        case 'ConfirmationsDetailsScreenPage':
            return libMobile.isServiceOrderStatusChangeable(context);
        default:
            return true;
    }
}
