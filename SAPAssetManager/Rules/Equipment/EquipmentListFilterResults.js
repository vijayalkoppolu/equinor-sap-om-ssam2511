import FilterLibrary from '../Filter/FilterLibrary';
import { createNewWorkCenterFilterCriteria } from '../FastFilters/WorkCenterFastFilter';

/** @param {IClientAPI} context  */
export default async function EquipmentListFilterResults(context) {

    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    const [sortFilter, statusFilter, myEquipFilter] = ['SortFilter', 'StatusFilter', 'MyEquipmentsFilter'].map(n => fcContainer.getControl(n).getValue());
    FilterLibrary.formatDescendingSorterDisplayText(sortFilter);
    const newWcFilter = await createNewWorkCenterFilterCriteria(context, fcContainer.getControl('WorkCenterFilter').getFilterValue(), 'MaintWorkCenter');
    return [sortFilter, statusFilter, myEquipFilter, newWcFilter].filter(i=> !!i);
}
