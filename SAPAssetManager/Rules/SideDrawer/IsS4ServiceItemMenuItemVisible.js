import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import IsS4ServiceOrderFeatureEnabled from '../ServiceOrders/IsS4ServiceOrderFeatureEnabled';

export default function IsS4ServiceItemMenuItemVisible(context) {
    return IsS4ServiceIntegrationEnabled(context) && IsS4ServiceOrderFeatureEnabled(context);
}
