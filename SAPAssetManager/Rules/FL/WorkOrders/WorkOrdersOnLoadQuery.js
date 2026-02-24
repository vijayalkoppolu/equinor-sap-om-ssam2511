import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export const WORK_ORDERS_OPEN_FILTER = "FldLogsWoProduct_Nav/any(p: p/Status eq '')";
export const WORK_ORDERS_COMPLETED_FILTER = "FldLogsWoProduct_Nav/all(p: p/Status eq 'R')";

export default function WorkOrdersOnLoadQuery(context) {
    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('FldLogsWoResvItem_Nav', 'FldLogsWoProduct_Nav');
    queryBuilder.orderBy('Order');

    return WorkOrdersListFilterAndSearchQuery(context, true, false).then(filterQuery => {
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
 * @returns Search Query for Voyages
 */
export function getWorkOrdersSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['Order', 'Reservation'];
        ModifyListViewSearchCriteria(context, 'FldLogsWorkOrders', searchByProperties);
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }
    return searchQuery;
}

/**
 * 
 * @param {*} context 
 * @param {*} addFilterAndSearch 
 * @returns Filter Query for WorkOrders with/without filter and search
 */
export function WorkOrdersListFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
    let filterOptions = [];
    if (addFilter) {
        filterOptions.push(getCurrentFilters(context));
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getWorkOrdersSearchQuery(context, context.searchString.toLowerCase()));
    }
    
    return removeWorkOrderDeletedItems(context).then(discardFilterString => {
        if (discardFilterString) {
            filterOptions.push(discardFilterString);
        }
        const finalFilterString = filterOptions.filter(filterOption => !!filterOption).reduce((filterString, filterOption) => {
            return CommonLibrary.attachFilterToQueryOptionsString(filterString, filterOption);
        }, '');
        return finalFilterString;
    });
}

export function removeWorkOrderDeletedItems(context, baseQueryFilter) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'OnDemandObjects', [], "$filter=Action eq 'D' and ObjectType eq 'WNO'&$orderby=ObjectId").then(results => {
        if (ValidationLibrary.evalIsEmpty(results)) {
            return baseQueryFilter;
        }
        const terms = Array.from(results, i => i.ObjectId)
            .map(ObjectId => `ObjectId ne '${ObjectId}'`).join(' and ');
        return baseQueryFilter ? [baseQueryFilter, terms].join(' and ') : `${terms}`;
    });
}

function getCurrentFilters(context) {
    if (ValidationLibrary.evalIsEmpty(context.getPageProxy().getControls())) {
        return `(${WORK_ORDERS_OPEN_FILTER})`;
    }
    return CommonLibrary.getFormattedQueryOptionFromFilter(context);
}
