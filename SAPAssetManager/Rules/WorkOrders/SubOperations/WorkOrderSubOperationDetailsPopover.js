import libWOStatus from '../MobileStatus/WorkOrderMobileStatusLibrary';
import ODataLibrary from '../../OData/ODataLibrary';

export default function WorkOrderSubOperationDetailsPopover(context) {
    let isLocal = ODataLibrary.isLocal(context.binding);
    if (!isLocal) {
        return libWOStatus.isOrderComplete(context).then(status => {
            if (!status) {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/WorkOrderSubOperationDetailsPopover.action');
            } else {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderUpdateNotChangeable.action');
            }
        });
    }
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/WorkOrderSubOperationDetailsPopover.action');
}
