import IsS4ServiceRequestCreateEnabled from '../ServiceOrders/ServiceRequests/IsS4ServiceRequestCreateEnabled';
import { IsBusinessPartnerAddOrderOrRequestVisible } from './IsBusinessPartnerAddOrderVisible';

export default function IsBusinessPartnerAddRequestVisible(context) {
    if (!IsS4ServiceRequestCreateEnabled(context)) return false;
    return IsBusinessPartnerAddOrderOrRequestVisible(context);
}
