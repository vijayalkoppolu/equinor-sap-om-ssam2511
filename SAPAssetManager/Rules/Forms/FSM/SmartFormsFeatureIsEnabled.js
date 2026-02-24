import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';
import libForms from './FSMSmartFormsLibrary';

export default function SmartFormsFeatureIsEnabled(context) {
    if (IsS4ServiceIntegrationEnabled(context)) return libForms.isS4SmartFormsFeatureEnabled(context);
    return libForms.isSmartFormsFeatureEnabled(context);
}
