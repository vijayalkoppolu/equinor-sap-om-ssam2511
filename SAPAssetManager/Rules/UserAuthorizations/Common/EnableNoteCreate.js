/**
* Show/hide Note add button based on parent object and user authorization
* @param {IClientAPI} context
*/
import editNotificationEnabled from '../Notifications/EnableNotificationEdit';
import editWorkOrderEnabled from '../WorkOrders/EnableWorkOrderEdit';
import WCMNotesLibrary from '../../WCM/WCMNotes/WCMNotesLibrary';
import NotesListLibrary from '../../Notes/List/NotesListLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import PartDetailsAddButtonVisible from '../../Parts/Details/PartDetailsAddButtonVisible';

export default function EnableNoteCreate(context) {
    if (NotesListLibrary.isListNote(context)) {
        return false;
    }

    // Enable note creation depending on the entity set
    const entityName = context.binding['@odata.type'];
    switch (entityName) {
        case libCom.getGlobalDefinition(context, 'ODataTypes/Notification.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/NotificationItem.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/NotificationTask.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/NotificationItemTask.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/NotificationActivity.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/NotificationItemActivity.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/NotificationItemCause.global'):
            return editNotificationEnabled(context);
        case libCom.getGlobalDefinition(context, 'ODataTypes/S4ServiceOrder.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/S4ServiceRequest.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/WorkOrder.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/WorkOrderOperation.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/WorkOrderSubOperation.global'):
            return editWorkOrderEnabled(context);
        case libCom.getGlobalDefinition(context, 'ODataTypes/WCMDocumentItem.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/FunctionalLocation.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/Equipment.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/PurchaseOrderHeader.global'):
            return false;
        case libCom.getGlobalDefinition(context, 'ODataTypes/S4ServiceConfirmation.global'):
            return true;
        case libCom.getGlobalDefinition(context, 'ODataTypes/WCMApplication.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/WCMApproval.global'):
        case libCom.getGlobalDefinition(context, 'ODataTypes/WCMDocumentHeader.global'):
            return WCMNotesLibrary.enableNoteCreateForSpecificTextType(context);
        case libCom.getGlobalDefinition(context, 'ODataTypes/WorkOrderComponent.global'):
            return PartDetailsAddButtonVisible(context);
        case libCom.getGlobalDefinition(context, 'ODataTypes/WorkOrderTool.global'):
            return libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.WO.Edit') === 'Y';
        default:
            return true;
    }
}
