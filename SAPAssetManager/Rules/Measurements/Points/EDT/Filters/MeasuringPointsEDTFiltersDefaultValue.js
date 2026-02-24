import IsS4ServiceIntegrationEnabled from '../../../../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function MeasuringPointsEDTFiltersDefaultValue(context) {
    const filters = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().filters;
    const IsS4Enabled = IsS4ServiceIntegrationEnabled(context);

    if (filters.active) {
        switch (context.getName()) {
            case 'Equipment': {
                return filters.active.equipment;
            }
            case 'FuncLoc': {
                return filters.active.floc;
            }
            case 'FilterPRT': {
                return !!filters.active.prt;
            }
            case 'FilterSeg': {
                return filters.active.statuses;
            }
            case 'Operations': {
                return IsS4Enabled ? undefined : filters.active.operations;
            }
            case 'S4Items': {
                return IsS4Enabled ? filters.active.operations : undefined;
            }
            default:
                return '';
        }
    }

    return '';
}
