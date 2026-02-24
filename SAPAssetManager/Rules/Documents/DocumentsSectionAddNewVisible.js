import IsClassicLayoutEnabled from '../Common/IsClassicLayoutEnabled';
import EnableAttachmentCreate from '../UserAuthorizations/Attachments/EnableAttachmentCreate';
import libDocument from './DocumentLibrary';
import libNotifStatus from '../Notifications/MobileStatus/NotificationMobileStatusLibrary';

export default async function DocumentsSectionAddNewVisible(context) {
    let isNotComplete = true;
    let type = libDocument.getParentObjectType(context);

    if (type === libDocument.ParentObjectType.Notification) {
        if (await libNotifStatus.isNotificationComplete(context)) {
            isNotComplete = false; //Don't allow adding to a complete notification
        }
    }

    return !IsClassicLayoutEnabled(context) && await EnableAttachmentCreate(context) && isNotComplete;
}
