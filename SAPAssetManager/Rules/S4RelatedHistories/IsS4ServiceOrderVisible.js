import IsS4ServiceOrderFeatureEnabled from '../ServiceOrders/IsS4ServiceOrderFeatureEnabled';
import IsS4Visible from './IsS4Visible';

export default function IsS4ServiceOrderVisible(context) {
    return IsS4Visible(context) && IsS4ServiceOrderFeatureEnabled(context);
}
