import NotificationIsSamePlanningPlant from '../FunctionalLocation/NotificationIsSamePlanningPlant';
import WorkOrderIsSamePlanningPlant from '../FunctionalLocation/WorkOrderIsSamePlanningPlant';
import IsS4ServiceOrderCreateEnabled from '../ServiceOrders/CreateUpdate/IsS4ServiceOrderCreateEnabled';
import IsS4ServiceRequestCreateEnabled from '../ServiceOrders/ServiceRequests/IsS4ServiceRequestCreateEnabled';
import IsWCMOperator from '../WCM/IsWCMOperator';
import EquipmentTakeReadingIsVisible from './EquipmentTakeReadingIsVisible';
import InstallationVisible from './Installation/InstallationVisible';
import UninstallVisible from './Uninstall/UninstallVisible';
import SDFCreateEnabled from '../Forms/SDF/SDFCreateEnabled';

/**
* Checks all of the individual menu item rules and only show the menu if one of them is true
* @param {IClientAPI} context
*/
export default async function EquipmentDetailsPopoverIsVisible(context) {
    if (IsWCMOperator(context)) {
        return false;
    }

    // resolve asynchronous rules
    const itemsVisibility = await Promise.all([
        EquipmentTakeReadingIsVisible(context),
        UninstallVisible(context),
    ]);
    
    return [
        ...itemsVisibility,
        WorkOrderIsSamePlanningPlant(context),
        NotificationIsSamePlanningPlant(context),
        InstallationVisible(context),
        SDFCreateEnabled(context),
        IsS4ServiceOrderCreateEnabled(context),
        IsS4ServiceRequestCreateEnabled(context),
    ].some(visibility => visibility);
}
