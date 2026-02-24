import isAndroid from '../../Common/IsAndroid';
import ODataLibrary from '../../OData/ODataLibrary';

export default function NotificationItemIconImages(context) {
    
    const {ItemTasks, ItemCauses, ItemActivities} = context.binding;

    const localTasksExist = ItemTasks && ItemTasks.some(task => ODataLibrary.hasAnyPendingChanges(task));
    const localCausesExist = ItemCauses && ItemCauses.some(cause => ODataLibrary.hasAnyPendingChanges(cause));
    const localActivitiesExist = ItemActivities && ItemActivities.some(activity => ODataLibrary.hasAnyPendingChanges(activity));

    // check if this Notification Item has been locally created
    if (ODataLibrary.hasAnyPendingChanges(context.getBindingObject()) || localTasksExist || localCausesExist || localActivitiesExist) {
        return [isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png'];
    } else {
        return [];
    }
}
