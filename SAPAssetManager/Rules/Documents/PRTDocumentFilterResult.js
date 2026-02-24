import FilterLibrary from '../Filter/FilterLibrary';

export default function PRTDocumentFilterResult(context) {
    let result1 = context.evaluateTargetPath('#Page:PRTDocumentFilterPage/#Control:SortFilter/#Value');
    FilterLibrary.formatDescendingSorterDisplayText(result1);

    return [result1];
}
