import isAndroid from '../../Common/IsAndroid';
import AttachedDocumentIcon from '../../Documents/AttachedDocumentIcon';
import ODataLibrary from '../../OData/ODataLibrary';

export default function NotificationListViewIconImages(context) {
    const iconImage = [];
    
    // check if this Notification has any docs
    const docIcon = AttachedDocumentIcon(context, context.binding.NotifDocuments);
    if (docIcon) {
        console.log('docIcon: ******************');
        iconImage.push(docIcon);
    }

    const {Tasks, Items, Activities} = context.binding;

    const localTasksExist = getLocalTasks(Tasks);
    const localItemsExist = getLocalItems(Items);
    const localActivitiesExist = getActivities(Activities);

    // check if this Notification has been locally created
    const isNotificationCreatedLocally = checkIsNotificationCreatedLocally(context, localTasksExist, localItemsExist, localActivitiesExist);
    if (isNotificationCreatedLocally) {
        console.log('isNotificationCreatedLocally: ******************');
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
        return iconImage;
    }

    // Check for local changes to tasks, causes, and activities at the item level only if the previous check at notification level has not passed
    if (Items) {
        for (const element of Items) {
            const localItemTasksExist = element.ItemTasks.some(task => ODataLibrary.hasAnyPendingChanges(task));
            const localItemCausesExist = element.ItemCauses.some(cause => ODataLibrary.hasAnyPendingChanges(cause));
            const localItemActivitiesExist = element.ItemActivities.some(activity => ODataLibrary.hasAnyPendingChanges(activity));
            if (localItemTasksExist || localItemCausesExist || localItemActivitiesExist) {
                console.log('localItemTasksExist: ******************');
                iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
                return iconImage;
            }
        }
    }

    return iconImage;
}

function getLocalTasks(Tasks) {
    return Tasks && Tasks.some(task => ODataLibrary.hasAnyPendingChanges(task));
}

function getLocalItems(Items) {
    return Items && Items.some(item => ODataLibrary.hasAnyPendingChanges(item));
}

function getActivities(Activities) {
    return Activities && Activities.some(activity => ODataLibrary.hasAnyPendingChanges(activity));
}

function checkIsNotificationCreatedLocally(context, localTasksExist, localItemsExist, localActivitiesExist) {
    let binding = context.getBindingObject();
    return ODataLibrary.hasAnyPendingChanges(binding) || ODataLibrary.hasAnyPendingChanges(binding.NotifMobileStatus_Nav) || ODataLibrary.hasAnyPendingChanges(binding.HeaderLongText[0]) || localTasksExist || localItemsExist || localActivitiesExist;
}
