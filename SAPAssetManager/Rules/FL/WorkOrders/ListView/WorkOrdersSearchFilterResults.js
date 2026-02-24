import FilterLibrary from '../../../Filter/FilterLibrary';

/**
* @param {IClientAPI} context
*/
export default function WorkOrdersSearchFilterResults(context) {
    const fcWorkOrders = context.getControl('FormCellContainer');
    const sortFilterValue = fcWorkOrders.getControl('SortFilter').getValue();
    FilterLibrary.formatDescendingSorterDisplayText(sortFilterValue);

    const filterResults = ['FLWorkOrderFilter', 'FLReservationFilter'].map((n) => fcWorkOrders.getControl(n).getFilterValue());
    filterResults.push(sortFilterValue);
    return filterResults;
}
