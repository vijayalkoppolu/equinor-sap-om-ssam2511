import IsS4ServiceIntegrationEnabled from '../../../../ServiceOrders/IsS4ServiceIntegrationEnabled';
import { WorkOrderOperationDetailsPageNameToOpen } from '../../../../WorkOrders/Operations/Details/WorkOrderOperationDetailsPageToOpen';

export default function MeasuringPointsEDTFilterIsVisible(context) {
    let filters = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().filters;
    const parentPageName = context.evaluateTargetPath('#Page:-Previous').previousPage.id;

    switch (context.getName()) {
        case 'Equipment' : {
            return filters.EQUIPMENT && filters.EQUIPMENT.length > 0;
        }
        case 'FuncLoc': { 
            return filters.FLOC && filters.FLOC.length > 0;
        }
        case 'Operations' : {
            if (['PRTListViewPage', WorkOrderOperationDetailsPageNameToOpen(context)].includes(parentPageName)) {
                return false;
            }

            let isDataExist = filters.OPERATIONS && filters.OPERATIONS.length > 0;
            return IsS4ServiceIntegrationEnabled(context) ? false : isDataExist;
        }
        case 'S4Items': {
            let isDataExist = filters.OPERATIONS && filters.OPERATIONS.length > 0;
            return IsS4ServiceIntegrationEnabled(context) ? isDataExist : false;
        }
        case 'FilterPRT': {
            if (parentPageName === 'PRTListViewPage') {
                return false;
            }

            return (filters.PRT && filters.PRT.length > 0) || filters.OPERATIONS_WITH_PRT_EXIST;
        }
        default: {
            return true;
        }
    }
}
