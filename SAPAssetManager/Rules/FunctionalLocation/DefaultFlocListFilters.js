import FilterSettings from '../Filter/FilterSettings';
import { getMyFunctionalLocationsFilterQuery } from './FunctionalLocationFilterByFilter';
import IsOverviewTabPage from '../Common/TabPage/IsOverviewTabPage';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default async function DefaultFlocListFilters(context) {

    let defaultFilters = [
        context.createFilterCriteria(context.filterTypeEnum.Sorter, 'FuncLocIdIntern', undefined, ['FuncLocIdIntern'], false, context.localizeText('sort_filter_prefix'), [context.localizeText('ID')]),
    ];

    // Only add the "My Functional Locations" filter if on tab page 
    if (IsOverviewTabPage(context)) {
        const myFlocFilter = context.createFilterCriteria(context.filterTypeEnum.Filter, 'MyFlocFilter', undefined, [getMyFunctionalLocationsFilterQuery(context)], true, '', [context.localizeText('my_functional_locations')]);
        defaultFilters.push(...[myFlocFilter]);
    }

    FilterSettings.saveInitialFilterForPage(context, defaultFilters);
    
    // If saved filters exist, don't apply the default filters
    const savedFiltersExist = await FilterSettings.savedFilterSettingsExist(context);
    return savedFiltersExist ? []: defaultFilters;
}
