import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../../LCNC/ModifyListViewSearchCriteria';


export default function AssignToVoyageQuery(context) {

    let queryBuilder = context.dataQueryBuilder();

    return AssignToVoyageFilterAndSearchQuery(context, true, true).then(filterQuery => {
        if (filterQuery) {
            queryBuilder.filter(filterQuery.replace('$filter=', ''));
        }
        return queryBuilder;
    });
}

/**
 * 
 * @param {*} context 
 * @param {*} searchString 
 * @returns Search Query for Assign To Voyage
 */
export function getAssignToVoyageSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['VoyageNumber', 'SourcePlant','SourceStage','DestinationPlant','DestinationStage'];
        ModifyListViewSearchCriteria(context, 'FldLogsVoyageMasters', searchByProperties);
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}

/*
 * 
 * @param {*} context 
 * @param {*} addFilterAndSearch 
 * @returns Filter Query for Assign To Voyage with/without filter and search
 */
export function AssignToVoyageFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
    let filterOptions = [];
    if (addFilter) {
        filterOptions.push(getCurrentFilters(context));
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getAssignToVoyageSearchQuery(context, context.searchString.toLowerCase()));
    }
    const finalFilterString = filterOptions.filter(filterOption => !!filterOption).reduce((filterString, filterOption) => {
        return CommonLibrary.attachFilterToQueryOptionsString(filterString, filterOption);
    }, '');
    return Promise.resolve(finalFilterString);
}

/**
 * 
 * @param {*} context 
 * @returns Currently set filters. In case of page onLoaded event, we should return the preselected filter.
 */
function getCurrentFilters(context) {
    return CommonLibrary.getFormattedQueryOptionFromFilter(context);
}

