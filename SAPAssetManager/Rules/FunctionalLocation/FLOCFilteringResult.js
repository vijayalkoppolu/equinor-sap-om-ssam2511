import FilterLibrary from '../Filter/FilterLibrary';
import { createNewWorkCenterFilterCriteria } from '../FastFilters/WorkCenterFastFilter';

export default async function FLOCFilteringResult(context) {
    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    const [sortFilter, myFlocFilter] = ['SortFilter', 'MyFlocFilter'].map(n => fcContainer.getControl(n).getValue());
    FilterLibrary.formatDescendingSorterDisplayText(sortFilter);
    const newWcFilter = await createNewWorkCenterFilterCriteria(context, fcContainer.getControl('WorkCenterFilter').getFilterValue(), 'WorkCenter');
    return [sortFilter, myFlocFilter, newWcFilter].filter(i=> !!i);
}
