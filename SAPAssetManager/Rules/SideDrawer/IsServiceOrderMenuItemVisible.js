import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import IsS4ServiceOrderFeatureEnabled from '../ServiceOrders/IsS4ServiceOrderFeatureEnabled';
import EnableFieldServiceTechnician from './EnableFieldServiceTechnician';

export default function IsServiceOrderMenuItemVisible(context) {
    if (!EnableFieldServiceTechnician(context)) return false;
    
    return IsS4ServiceIntegrationEnabled(context) ? IsS4ServiceOrderFeatureEnabled(context) : true;
}
