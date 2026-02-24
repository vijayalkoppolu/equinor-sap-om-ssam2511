import WorkOrdersFilterCaptionOpen from './WorkOrdersFilterCaptionOpen';
import { WORK_ORDERS_OPEN_FILTER } from '../WorkOrdersOnLoadQuery';
/*
* This function sets default filter for WorkOrders List
* @param {IClientAPI} context
*/
export default function GetFLWorkOrdersPreSelectedFilter(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'OpenWorkOrders', [WorkOrdersFilterCaptionOpen(context)],[WORK_ORDERS_OPEN_FILTER], true)];
}
