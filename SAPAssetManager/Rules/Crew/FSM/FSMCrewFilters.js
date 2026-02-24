import FilterSettings from '../../Filter/FilterSettings';

export default function FSMCrewFilters(context) {
    const sorting = context.createFilterCriteria(context.filterTypeEnum.Sorter, 'Name', undefined, ['Name'], false, context.localizeText('sort_filter_prefix'), [context.localizeText('name')]);
    FilterSettings.saveInitialFilterForPage(context, [sorting]);
    return [sorting];
}
