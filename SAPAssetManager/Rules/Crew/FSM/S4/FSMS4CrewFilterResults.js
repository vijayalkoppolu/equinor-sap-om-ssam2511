import FilterLibrary from '../../../Filter/FilterLibrary';

export default function FSMS4CrewFilterResults(context) {
    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    const [sortFilter, statusFilter] = ['SortFilter', 'StatusFilter'].map(n => fcContainer.getControl(n).getValue());

    FilterLibrary.formatDescendingSorterDisplayText(sortFilter);
    return [sortFilter, statusFilter].filter(c => !!c);
}
