import EnableNotificationEdit from '../../../UserAuthorizations/Notifications/EnableNotificationEdit';
import libNotifStatus from '../../MobileStatus/NotificationMobileStatusLibrary';

export default async function EnableNotificationActivityCreate(context) {
    let isComplete = await libNotifStatus.isNotificationComplete(context);

    return EnableNotificationEdit(context) && !isComplete; 
}
