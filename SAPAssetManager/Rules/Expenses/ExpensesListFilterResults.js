import FilterLibrary from '../Filter/FilterLibrary';

export default function ExpensesListFilterResults(context) {
    let result1 = context.evaluateTargetPath('#Page:ExpensesFilterPage/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:ExpensesFilterPage/#Control:ActivityTypeLstPicker/#FilterValue');
    let result3 = context.evaluateTargetPath('#Page:ExpensesFilterPage/#Control:ServiceOrderLstPicker/#FilterValue');
    FilterLibrary.formatDescendingSorterDisplayText(result1);

    let filterResults = [result1, result2, result3];

    return filterResults;
}
