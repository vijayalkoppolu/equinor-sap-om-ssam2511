import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import { IN_PACKING_STATUS_FILTER } from './FLPackContainerFilterCaptionInPacking';

export default function PackedContainersOnLoadQuery(context) {

    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('FldLogsCtnPkgPackingStatus_Nav', 'FldLogsPackCtnContainerItem_Nav', 'FldLogsPackCtnContainerPkg_Nav', 'FldLogsPackCtnContainerVyg_Nav');
    queryBuilder.orderBy('FldLogsContainerID');

    return PackedContainersListFilterAndSearchQuery(context, true, false).then(filterQuery => {
        if (filterQuery) {
            queryBuilder.filter(filterQuery.replace('$filter=', ''));
        }
        return queryBuilder;
    });
}

export function PackedContainersListFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
    let filterOptions = [];
    if (addFilter) {
        filterOptions.push(getCurrentFilters(context));
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getPackedContainersSearchQuery(context, context.searchString.toLowerCase()));
    }

    const finalFilterString = filterOptions.filter(filterOption => !!filterOption).reduce((filterString, filterOption) => {
        return CommonLibrary.attachFilterToQueryOptionsString(filterString, filterOption);
    }, '');
    return Promise.resolve(finalFilterString);
}

export function getPackedContainersSearchQuery(context, searchString) {
    let searchQuery = '';
    if (searchString) {
        let searchByProperties = ['FldLogsContainerID', 'FldLogsContainerCategoryText', 'FldLogsSrcePlnt', 'FldLogsDestPlnt','FldLogsShptCtnIntTranspStsText','FldLogsVoyAssgmtStatusText','FldLogsCtnPackgStsText'];
        ModifyListViewSearchCriteria(context, 'FldLogsPackCtnPkdCtns', searchByProperties);
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }
    return searchQuery;
}

function getCurrentFilters(context) {
    if (ValidationLibrary.evalIsEmpty(context.getPageProxy().getControls())) {
        return `(${IN_PACKING_STATUS_FILTER})`;
    }
    return CommonLibrary.getFormattedQueryOptionFromFilter(context);
}
