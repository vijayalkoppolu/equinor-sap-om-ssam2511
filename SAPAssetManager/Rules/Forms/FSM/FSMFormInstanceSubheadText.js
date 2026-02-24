import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';

/**
 * Return the correct metadata properties based on backend configuration (S4 or regular)
 * @param {*} context 
 * @returns 
 */
export default function FSMFormsInstanceSubheadText(context) {
    const binding = context.binding || {};

    if (IsS4ServiceIntegrationEnabled(context)) {
        if (binding.S4ServiceItemNumber && binding.S4ServiceItemNumber !== '000000') {
            return '{{#Property:S4ServiceOrderId}} - {{#Property:S4ServiceItemNumber}}';
        } else {
            return '{{#Property:S4ServiceOrderId}}';
        }
    }

    if (binding.Operation && binding.Operation !== '0000') {
        return '{{#Property:WorkOrder}} - {{#Property:Operation}}';
    }

    return '{{#Property:WorkOrder}}';
}
