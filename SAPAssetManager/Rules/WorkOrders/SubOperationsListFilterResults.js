import FilterLibrary from '../Filter/FilterLibrary';

const cachedSubOperationsListFilterResults = (context) => FilterLibrary.cacheFilterResultIntoClientData(context, SubOperationsListFilterResults);
export default cachedSubOperationsListFilterResults;

function SubOperationsListFilterResults(context) {
    let clientData = context.evaluateTargetPath('#Page:-Previous/#ClientData');
    let filterResults = GetSubOperationsListFilterCriteria(context);
    const mobileStatusFilter = filterResults.find(c => c.name === 'SubOpMobileStatus_Nav/MobileStatus');

    if (clientData.SubOperationFastFiltersClass) {
        filterResults = filterResults.concat(clientData.SubOperationFastFiltersClass.getFastFilterValuesFromFilterPage(context, mobileStatusFilter));
    }

    return filterResults;
}

function GetSubOperationsListFilterCriteria(context) {
    let result1 = context.evaluateTargetPath('#Page:SubOperationsFilterPage/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:SubOperationsFilterPage/#Control:MobileStatusFilter/#Value');
    let result3 = context.evaluateTargetPath('#Page:SubOperationsFilterPage/#Control:MySubOperationsFilter/#Value');
    FilterLibrary.formatDescendingSorterDisplayText(result1);

    let filterResults = [result1, result2, result3];

    return filterResults;
}
