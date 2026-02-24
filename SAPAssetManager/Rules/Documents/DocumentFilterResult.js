import FilterLibrary from '../Filter/FilterLibrary';

export default function DocumentFilterResult(context) {
    let result1 = context.evaluateTargetPath('#Page:DocumentFilterPage/#Control:SortFilter/#Value');
    FilterLibrary.formatDescendingSorterDisplayText(result1);

    return [result1];
}
