import FilterSettings from '../Filter/FilterSettings';
import { getMyEquipmentFilterQuery } from './MyEquipmentsFilter';
import IsOverviewTabPage from '../Common/TabPage/IsOverviewTabPage';

export default async function DefaultOrderByEquipmentId(context) {
    let defaultFilters = [context.createFilterCriteria(context.filterTypeEnum.Sorter, 'EquipId', undefined, ['EquipId'], false, context.localizeText('sort_filter_prefix'), [context.localizeText('equipment_id')])];

    // Only add the "My Equipment" filter if on tab page 
    if (IsOverviewTabPage(context)) {
        const myEquipFilter = context.createFilterCriteria(context.filterTypeEnum.Filter, 'MyEquipmentsFilter', undefined, [getMyEquipmentFilterQuery(context)], true, '', [context.localizeText('my_equipment')]);
        defaultFilters.push(...[myEquipFilter]);
    }

    FilterSettings.saveInitialFilterForPage(context, defaultFilters);
    
    // If saved filters exist, don't apply the default filters
    const savedFiltersExist = await FilterSettings.savedFilterSettingsExist(context);
    return savedFiltersExist ? []: defaultFilters;
}
