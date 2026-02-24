import IsPhaseModelEnabled from '../../../Common/IsPhaseModelEnabled';
import IsNotificationMinor from '../../MobileStatus/IsNotificationMinor';
import MobileStatusLibrary from '../../../MobileStatus/MobileStatusLibrary';
import EnableNotificationEdit from '../../../UserAuthorizations/Notifications/EnableNotificationEdit';
import libNotifStatus from '../../MobileStatus/NotificationMobileStatusLibrary';

export default async function EnableNotificationTaskCreate(context) {
    let isComplete = await libNotifStatus.isNotificationComplete(context);

    if (EnableNotificationEdit(context) && !isComplete) {
        return !(IsPhaseModelEnabled(context) && IsNotificationMinor(context, MobileStatusLibrary.getMobileStatus(context.binding, context)));
    } else {
        return false;
    }
}
