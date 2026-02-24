import IsS4ServiceIntegrationEnabled from '../../../../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function FSMDefaultUserQueryOptions(context) {
    const paramName = IsS4ServiceIntegrationEnabled(context) ? 'FSM_EMPLOYEE_S4' : 'FSM_EMPLOYEE';
    return `$filter=SystemSettingName eq '${paramName}'`;
}
