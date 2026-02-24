import CommonLibrary from '../../../Common/Library/CommonLibrary';
import FilterLibrary from '../../../Filter/FilterLibrary';
/**
* @param {IClientAPI} context
*/
export default function PackagesSearchFilterResults(context) {
    const fcPackage = context.getControl('FormCellContainer');
    const [sortFilterValue, dateSwitch] = ['SortFilter', 'DispatchDateSwitch'].map((n) => fcPackage.getControl(n).getValue());
    FilterLibrary.formatDescendingSorterDisplayText(sortFilterValue);

    const filterResults = ['VoyageNumberFilter', 'ContainerIDFilter', 'ContainerStatusFilter'].map((n) => fcPackage.getControl(n).getFilterValue());
    filterResults.push(sortFilterValue);
    if (dateSwitch) {
        filterResults.push(CommonLibrary.GetDateIntervalFilterValueDate(context, context.getClientData(), 'PackagesSearchFilterPage', 'DispatchDate', 'DispatchDateSwitch', 'StartDateFilter', 'EndDateFilter'));
    }
    return filterResults;
}
