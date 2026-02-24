import FilterLibrary from '../../../Filter/FilterLibrary';

/**
* @param {IClientAPI} context
*/
export default function HUDelItemsSearchFilterResults(context) {
    const fcDeliveryItem = context.getControl('FormCellContainer');
    const [sortFilterValue] = ['SortFilter'].map((n) => fcDeliveryItem.getControl(n).getValue());
    FilterLibrary.formatDescendingSorterDisplayText(sortFilterValue);

    const filterResults = ['VoyageNumberFilter', 'MaterialFilter', 'HandlingUnitIDFilter', 'ReferenceDocNumberFilter'].map((n) => fcDeliveryItem.getControl(n).getFilterValue());
    filterResults.push(sortFilterValue);
    return filterResults;
}
