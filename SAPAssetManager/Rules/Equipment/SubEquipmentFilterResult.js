import FilterLibrary from '../Filter/FilterLibrary';

export default function SubEquipmentFilterResult(context) {
    let result1 = context.evaluateTargetPath('#Page:SubEquipmentFilterPage/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:SubEquipmentFilterPage/#Control:StatusFilter/#Value');
    FilterLibrary.formatDescendingSorterDisplayText(result1);

    return [result1, result2];
}
