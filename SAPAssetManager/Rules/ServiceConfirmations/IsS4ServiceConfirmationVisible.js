import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import IsS4ServiceConfirmationEnabled from './IsS4ServiceConfirmationEnabled';

export default function IsS4ServiceConfirmationVisible(context) {
    return IsS4ServiceConfirmationEnabled(context) && IsS4ServiceIntegrationEnabled(context);
}
