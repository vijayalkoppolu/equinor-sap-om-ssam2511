import FilterLibrary from '../../../Filter/FilterLibrary';


const cachedServiceOrderListFilterResults = (context) => FilterLibrary.cacheFilterResultIntoClientData(context, ServiceOrderListFilterResults);
export default cachedServiceOrderListFilterResults;

/** @param {IPageProxy} context */
function ServiceOrderListFilterResults(context) {
    /** @type {import('../ServiceOrderFastFiltersItems').SOListPageClientData} */
    const clientData = context.evaluateTargetPath('#Page:ServiceOrdersListViewPage/#ClientData');
    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    let filterCriterias = GetServiceOrderListFilterCriteria(context, false);
    const mobileStatusFilter = filterCriterias.find(c => c.name === 'MobileStatus_Nav/MobileStatus');

    let fastFilterCriterias = clientData.SOFastFilters.getFastFilterValuesFromFilterPage(context, mobileStatusFilter);

    const [dueDatetart, dueDateEnd, dueDateVisibleSwitch] = ['DueStartDateFilter', 'DueEndDateFilter', 'DueDateSwitch'].map(n => fcContainer.getControl(n));
    const duebyFilterCriteria = FilterLibrary.getDateIntervalFilterCriteria(context, dueDatetart, dueDateEnd, dueDateVisibleSwitch, 'DueBy');
    const sameDueDateRelatedFilterCriteria = duebyFilterCriteria ? fastFilterCriterias.find((/** @type {FilterCriteria} */ c) => c.filterItems.some(term => term.includes(duebyFilterCriteria.filterItems[0]))) : undefined;
    if (!sameDueDateRelatedFilterCriteria) {  // if dueBy is not equivalent with dueToday fastfilter, then picker takes precedence
        filterCriterias.push(duebyFilterCriteria);
    }
    if (!sameDueDateRelatedFilterCriteria || dueDateVisibleSwitch.getValue() === false) {  // if picker is set differently or disabled, then omit th duetoday fastfilter
        fastFilterCriterias = fastFilterCriterias.filter((/** @type {FilterCriteria} */ c) => !c.filterItems.some(term => term.includes('DueBy g')));  // like DueBy gt/ge
    }

    return [...filterCriterias, ...fastFilterCriterias].filter(c => !!c); // filter out the undefined criterias
}

/** @param {IPageProxy} context */
function GetServiceOrderListFilterCriteria(context, addDueByFilter = true) {
    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    const [sortFilter, mobileStatusFilter, priorityFilter] = ['SortFilter', 'MobileStatusFilter', 'PriorityFilter'].map(n => fcContainer.getControl(n).getValue());
    FilterLibrary.formatDescendingSorterDisplayText(sortFilter);

    let filterCriterias = [sortFilter, mobileStatusFilter, priorityFilter];

    const [reqDatetart, reqDateEnd, reqDateVisibleSwitch] = ['ReqStartDateFilter', 'ReqEndDateFilter', 'RequestStartDateSwitch'].map(n => fcContainer.getControl(n));
    filterCriterias.push(FilterLibrary.getDateIntervalFilterCriteria(context, reqDatetart, reqDateEnd, reqDateVisibleSwitch, 'RequestedStart'));

    if (addDueByFilter) {
        const [dueDateStart, dueDateEnd, dueDateVisibleSwitch] = ['DueStartDateFilter', 'DueEndDateFilter', 'DueDateSwitch'].map(n => fcContainer.getControl(n));
        const duebyFilterCriteria = FilterLibrary.getDateIntervalFilterCriteria(context, dueDateStart, dueDateEnd, dueDateVisibleSwitch, 'DueBy');
        filterCriterias.push(duebyFilterCriteria);
    }

    return [...filterCriterias].filter(c => !!c); // filter out the undefined criterias
}
