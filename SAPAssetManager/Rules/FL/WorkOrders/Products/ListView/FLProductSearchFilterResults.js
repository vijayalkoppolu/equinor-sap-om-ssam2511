/**
* 
* @param {IClientAPI} clientAPI
*/


import FilterLibrary from '../../../../Filter/FilterLibrary';

export default function FLProductSearchFilterResults(context) {
    const fcWorkOrders = context.getControl('FormCellContainer');
    const sortFilterValue = fcWorkOrders.getControl('SortFilter').getValue();
    FilterLibrary.formatDescendingSorterDisplayText(sortFilterValue);

    // Get filter values for Order and Reservation
    const filterResults = ['FLOPActivityFilter', 'FLSupplyProcessFilter', 'FLProductFilter'].map((n) => fcWorkOrders.getControl(n).getFilterValue());
    filterResults.push(sortFilterValue);
    return filterResults;
} 
