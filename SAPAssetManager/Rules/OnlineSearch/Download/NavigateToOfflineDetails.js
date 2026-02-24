import EquipmentDetailsNav from '../../Equipment/EquipmentDetailsNav';
import { navigateOnRead } from '../../FunctionalLocation/FunctionalLocationDetailsNav';
import { readAndNavigateToOfflineNotification } from '../../Notifications/OnlineDetails/NavToNotificationOnlineDetailsPage';
import WorkOrderDetailsNav from '../../WorkOrders/WorkOrderDetailsNav';

export default function NavigateToOfflineDetails(context) {
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
        const entityType = context.binding['@odata.type'];
        if (entityType === '#sap_mobile.Equipment') {
            return EquipmentDetailsNav(context);
        } else if (entityType === '#sap_mobile.NotificationHeader') {
            return readAndNavigateToOfflineNotification(context.getPageProxy(), context.binding.NotificationNumber);
        } else if (entityType === '#sap_mobile.WorkOrderHeader' 
                || entityType === '#sap_mobile.WorkOrderOperation'
                || entityType === '#sap_mobile.WorkOrderSubOperation') {
            return WorkOrderDetailsNav(context.getPageProxy(), true);
        }

        return navigateOnRead(context, `MyFunctionalLocations('${context.binding.FuncLocIdIntern}')`);
    });
}
