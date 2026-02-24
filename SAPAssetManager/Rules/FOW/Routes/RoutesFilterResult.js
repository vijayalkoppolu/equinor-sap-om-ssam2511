import FilterLibrary from '../../Filter/FilterLibrary';

export default function RoutesFilterResult(context) {
    let result1 = context.evaluateTargetPath('#Page:RouteFilterPage/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:RouteFilterPage/#Control:MobileStatusFilter/#Value');
    FilterLibrary.formatDescendingSorterDisplayText(result1);

    return [result1, result2];
}
