import { OperationLibrary as libOperations } from '../../../WorkOrders/Operations/WorkOrderOperationLibrary';

export default function TimeSheetEntryEditOperationQueryOptions(context) {
    if (context.binding.RecOrder) {
        return libOperations.attachOperationsFilterByAssgnTypeOrWCM(context, "$filter=OrderId eq '{{#Property:RecOrder}}'&$orderby=OperationNo asc");
    }

    return libOperations.attachOperationsFilterByAssgnTypeOrWCM(context);
}
