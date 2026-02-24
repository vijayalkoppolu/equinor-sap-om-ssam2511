import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
import S4ServiceLibrary from '../ServiceOrders/S4ServiceLibrary';
import S4MapQueryOptions from './S4MapQueryOptions';
import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';
import IsS4ServiceOrderFeatureDisabled from '../ServiceOrders/IsS4ServiceOrderFeatureDisabled';

export default async function S4OverviewMapQueryOptions(context) {
    if (IsS4ServiceOrderFeatureDisabled(context)) return '$filter=false';

    const defaultDates = libWO.getActualDates(context);
    let dateFilter;

    try {
        if (MobileStatusLibrary.isServiceItemStatusChangeable(context)) {
            dateFilter = await S4ServiceLibrary.itemsDateFilter(context, defaultDates);
            const objectIds = dateFilter.match(/ObjectID eq '(.\d+)'/g);
            if (objectIds?.length) {
                dateFilter = '(' + objectIds.join(' or ') + ')';
            }
        } else if (MobileStatusLibrary.isServiceOrderStatusChangeable(context)) {
            dateFilter = await S4ServiceLibrary.ordersDateFilter(context, defaultDates);
        }

        return S4MapQueryOptions(context, dateFilter);
    } catch (error) {
        return '$top=1';
    }
}
