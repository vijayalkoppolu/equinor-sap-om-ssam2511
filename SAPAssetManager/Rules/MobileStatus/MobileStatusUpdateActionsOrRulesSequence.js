import libCom from '../Common/Library/CommonLibrary';
import libTelemetry from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import ConfirmationOrItemStatusUpdateSequenceClass from '../Confirmations/Details/ConfirmationOrItemStatusUpdateSequenceClass';
import NotificationStatusUpdateSequenceClass from '../Notifications/MobileStatus/NotificationStatusUpdateSequenceClass';
import TaskStatusUpdateSequenceClass from '../Notifications/MobileStatus/TaskStatusUpdateSequenceClass';
import OperationStatusUpdateSequenceClass from '../Operations/MobileStatus/OperationStatusUpdateSequenceClass';
import S4ServiceObjectsStatusUpdateSequenceClass from '../ServiceOrders/Status/S4ServiceObjectsStatusUpdateSequenceClass';
import SubOperationStatusUpdateSequenceClass from '../SubOperations/MobileStatus/SubOperationStatusUpdateSequenceClass';
import WorkOrderStatusUpdateSequenceClass from '../WorkOrders/MobileStatus/WorkOrderStatusUpdateSequenceClass';
import OperationCapacityStatusUpdateSequenceClass from '../Operations/MobileStatus/OperationCapacityStatusUpdateSequenceClass';

export default function MobileStatusUpdateActionsOrRulesSequence(context, updateToStatus, binding) {
    libTelemetry.logUserEventWithMobileStatus(context, binding['@odata.type'], updateToStatus.MobileStatus);
    switch (binding['@odata.type']) {
        case libCom.getGlobalDefinition(context, 'ODataTypes/WorkOrder.global'):
            return WorkOrderStatusUpdateSequenceClass.getUpdateSequenceForStatus(context, binding, updateToStatus);
        case libCom.getGlobalDefinition(context, 'ODataTypes/WorkOrderOperation.global'):
            return OperationStatusUpdateSequenceClass.getUpdateSequenceForStatus(context, binding, updateToStatus);
        case libCom.getGlobalDefinition(context, 'ODataTypes/WorkOrderOperationCapacity.global'):
            return OperationCapacityStatusUpdateSequenceClass.getUpdateSequenceForStatus(context, binding, updateToStatus);
        case libCom.getGlobalDefinition(context, 'ODataTypes/WorkOrderSubOperation.global'):
            return SubOperationStatusUpdateSequenceClass.getUpdateSequenceForStatus(context, binding, updateToStatus);
        case libCom.getGlobalDefinition(context, 'ODataTypes/S4ServiceOrder.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/S4ServiceItem.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/S4ServiceRequest.global'):
            return S4ServiceObjectsStatusUpdateSequenceClass.getUpdateSequenceForStatus(context, binding, updateToStatus);
        case libCom.getGlobalDefinition(context, 'ODataTypes/S4ServiceConfirmation.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/S4ServiceConfirmationItem.global'):
            return ConfirmationOrItemStatusUpdateSequenceClass.getUpdateSequenceForStatus(context, binding);
        case libCom.getGlobalDefinition(context, 'ODataTypes/Notification.global'):
            return NotificationStatusUpdateSequenceClass.getUpdateSequenceForStatus(context, binding, updateToStatus);
        case libCom.getGlobalDefinition(context, 'ODataTypes/NotificationTask.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/NotificationItemTask.global'):
            return TaskStatusUpdateSequenceClass.getUpdateSequenceForStatus(context, binding, updateToStatus);
        default:
            return [];
    }
}
