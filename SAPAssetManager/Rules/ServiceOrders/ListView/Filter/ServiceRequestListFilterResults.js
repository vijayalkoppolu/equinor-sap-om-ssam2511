import FilterLibrary from '../../../Filter/FilterLibrary';

const cachedServiceRequestListFilterResults = (context) => FilterLibrary.cacheFilterResultIntoClientData(context, ServiceRequestListFilterResults);
export default cachedServiceRequestListFilterResults;

/** @param {IPageProxy} context */
function ServiceRequestListFilterResults(context) {
    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    let filterCriterias = GetServiceRequestListFilterCriteria(context, fcContainer);

    /** @type {import('../../ServiceRequests/ServiceRequestsFastFiltersItems').ServiceRequestsListPageClientData} */
    const clientData = context.evaluateTargetPath('#Page:ServiceRequestsListViewPage/#ClientData');
    const mobileStatusFilter = filterCriterias.find(c => c.name === 'MobileStatus_Nav/MobileStatus');

    filterCriterias = filterCriterias.concat(clientData.serviceRequestsFastFilters.getFastFilterValuesFromFilterPage(context, mobileStatusFilter));
    return filterCriterias.filter(c => !!c); // filter out the undefined criterias
}

/** @param {IPageProxy} context */
/** @param {IControlProxy} container */
function GetServiceRequestListFilterCriteria(context, fcContainer) {
    const [sortFilter, mobileStatusFilter, priorityFilter] = ['SortFilter', 'MobileStatusFilter', 'PriorityFilter'].map(n => fcContainer.getControl(n).getValue());
    FilterLibrary.formatDescendingSorterDisplayText(sortFilter);

    let filterCriterias = [sortFilter, mobileStatusFilter, priorityFilter];

    const [reqDateStart, reqDateEnd, reqDateVisibleSwitch] = ['ReqStartDateFilter', 'ReqEndDateFilter', 'RequestStartDateSwitch'].map(n => fcContainer.getControl(n));
    filterCriterias.push(FilterLibrary.getDateIntervalFilterCriteria(context, reqDateStart, reqDateEnd, reqDateVisibleSwitch, 'RequestedStart'));

    const [dueDateStart, dueDateEnd, dueDateVisibleSwitch] = ['DueStartDateFilter', 'DueEndDateFilter', 'DueDateSwitch'].map(n => fcContainer.getControl(n));
    filterCriterias.push(FilterLibrary.getDateIntervalFilterCriteria(context, dueDateStart, dueDateEnd, dueDateVisibleSwitch, 'DueBy'));

    return filterCriterias.filter(c => !!c); // filter out the undefined criterias
}
