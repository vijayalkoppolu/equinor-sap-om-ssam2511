import IsS4ServiceOrderCreateEnabled from '../ServiceOrders/CreateUpdate/IsS4ServiceOrderCreateEnabled';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import EnableMultipleTechnician from '../SideDrawer/EnableMultipleTechnician';

export default function IsPartCreateUpdateOptionVisible(context) {
    return IsS4ServiceIntegrationEnabled(context) ? IsS4ServiceOrderCreateEnabled(context) : EnableMultipleTechnician(context);
}
