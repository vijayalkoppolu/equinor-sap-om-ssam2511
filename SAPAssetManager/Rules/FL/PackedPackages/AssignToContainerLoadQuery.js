import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';

export default function ContainersPackagesOnLoadQuery(context) {

    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.orderBy('FldLogsContainerID');

    return ContainersPackagesFilterAndSearchQuery(context, true, false).then(filterQuery => {
        if (filterQuery) {
            queryBuilder.filter(filterQuery.replace('$filter=', ''));
        }
        return queryBuilder;
    });
}

export function ContainersPackagesFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
    let filterOptions = ["(FieldLogisticsCtnIsOwned eq 'O' or FieldLogisticsCtnIsOwned eq 'L' or FieldLogisticsCtnIsOwned eq 'R' or FieldLogisticsCtnIsOwned eq 'T' or FieldLogisticsCtnIsOwned eq ' ')"];
    if (addFilter) {
        filterOptions.push(getCurrentFilters(context));
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getContainersPackagesSearchQuery(context, context.searchString.toLowerCase()));
    }

    const finalFilterString = filterOptions.filter(filterOption => !!filterOption).reduce((filterString, filterOption) => {
        return CommonLibrary.attachFilterToQueryOptionsString(filterString, filterOption);
    }, '');
    return Promise.resolve(finalFilterString);
}

export function getContainersPackagesSearchQuery(context, searchString) {
    let searchQuery = '';
    if (searchString) {
        let searchByProperties = ['FldLogsContainerID', 'FldLogsContainerText', 'FldLogsContainerCategoryText', 'FldLogsCtnCurrentLocation', 'FieldLogisticsCtnIsOwned'];
        ModifyListViewSearchCriteria(context, 'FldLogsCtnPackageIds', searchByProperties);
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }
    return searchQuery;
}

function getCurrentFilters(context) {
    if (ValidationLibrary.evalIsEmpty(context.getPageProxy().getControls())) {
        return '';
    }
    return CommonLibrary.getFormattedQueryOptionFromFilter(context);
}
