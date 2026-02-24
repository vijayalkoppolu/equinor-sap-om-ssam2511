import FilterLibrary from '../../Filter/FilterLibrary';

export default function MeasuringPointFilterResult(context) {
    let sortFilterResult = context.evaluateTargetPath('#Page:MeasuringPointsListFilterPage/#Control:SortFilter/#Value');
    FilterLibrary.formatDescendingSorterDisplayText(sortFilterResult);

    let counterFilterResult = context.evaluateTargetPath('#Page:MeasuringPointsListFilterPage/#Control:CounterFilter/#Value');
    let valCodeFilterResult = context.evaluateTargetPath('#Page:MeasuringPointsListFilterPage/#Control:ValCodeFilter/#Value');
  
    return [sortFilterResult, counterFilterResult, valCodeFilterResult];
}
