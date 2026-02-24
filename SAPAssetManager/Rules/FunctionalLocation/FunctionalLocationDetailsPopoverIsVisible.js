import EquipmentTakeReadingIsVisible from '../Equipment/EquipmentTakeReadingIsVisible';
import EquipmentInstallationVisible from '../Equipment/Installation/EquipmentInstallationVisible';
import UninstallVisible from '../Equipment/Uninstall/UninstallVisible';
import IsS4ServiceOrderCreateEnabled from '../ServiceOrders/CreateUpdate/IsS4ServiceOrderCreateEnabled';
import IsS4ServiceRequestCreateEnabled from '../ServiceOrders/ServiceRequests/IsS4ServiceRequestCreateEnabled';
import IsWCMOperator from '../WCM/IsWCMOperator';
import NotificationIsSamePlanningPlant from './NotificationIsSamePlanningPlant';
import WorkOrderIsSamePlanningPlant from './WorkOrderIsSamePlanningPlant';
import SDFCreateEnabled from '../Forms/SDF/SDFCreateEnabled';

/**
* Checks all of the individual menu item rules and only show the menu if one of them is true
* @param {IClientAPI} context
*/
export default async function FunctionalLocationDetailsPopoverIsVisible(context) {
    if (IsWCMOperator(context)) {
        return false;
    }

    // resolve asynchronous rules
    const itemsVisibility = await Promise.all([
        EquipmentTakeReadingIsVisible(context),
        EquipmentInstallationVisible(context),
        UninstallVisible(context),
    ]);

    return [
        ...itemsVisibility,
        WorkOrderIsSamePlanningPlant(context),
        NotificationIsSamePlanningPlant(context),
        SDFCreateEnabled(context),
        IsS4ServiceOrderCreateEnabled(context),
        IsS4ServiceRequestCreateEnabled(context),
    ].some(visibility => visibility);
}
