import S4ServiceLibrary from '../S4ServiceLibrary';

export default function GetPreselectedFilter(context) {
    const filter = S4ServiceLibrary.getServiceItemsFilterCriterias(context) || [];
    if (context.binding?.displayCrewQuickFilter) {
        filter.push(context.createFilterCriteria(context.filterTypeEnum.Filter,'',undefined,[context.binding.filter.replace('$filter=', '')],true,undefined,[context.binding.displayCrewQuickFilter]));
    }

    context.getClientData().initialFilter = filter.map(filterCriteria => filterCriteria.filterItems).filter(criteria => !!criteria);
    
    return filter;
}
