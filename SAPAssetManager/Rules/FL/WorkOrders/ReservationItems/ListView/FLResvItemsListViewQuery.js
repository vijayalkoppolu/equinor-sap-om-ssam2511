import ModifyListViewSearchCriteria from '../../../../LCNC/ModifyListViewSearchCriteria';
import libVal from '../../../../Common/Library/ValidationLibrary';
import libCom from '../../../../Common/Library/CommonLibrary';
import Logger from '../../../../Log/Logger';

export const RESVITEM_OPEN_FILTER = "Status eq ''";
export const RESVITEM_RETURNED_FILTER = "Status eq 'R'";
export const RESVITEM_DEFAULT_ORDERBY = 'Product';

/**
 * Build the List Query
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @returns Filter Query 
 */
export let openItems = [];
export let returnedItems = [];
export let filterFlag = [];
export default function FLResvItemsListViewQuery(context) {
    const queryBuilder = context.dataQueryBuilder();
    queryBuilder.orderBy(getSortfOptions(context));
    openItems.length = 0;
    returnedItems.length = 0;
    filterFlag.length = 0;
    let filterType = '';
    if (context.filters) {
        filterType = context?.filters[0]?._filterItems[0] === RESVITEM_OPEN_FILTER ? 'Open' : 'Returned';
    }

    try {
        const searchString = libCom.getStateVariable(context, 'searchString');
        /*Set the string after the page is loaded once */
        if (!libVal.evalIsEmpty(searchString) && context.getPageProxy()._page.isPageHasLoadedOnce) {
            context.searchString = searchString;
            libCom.setStateVariable(context, 'searchString', '');
            context.getControl('SectionedTable')?.redraw(true);
        }
    } catch (error) {
        Logger.error('FLOReservationItems', error);
    }

    const addFilterAndSearch = true;
    const filterQuery = ResvItemListFilterAndSearchQuery(context, addFilterAndSearch);

    if (filterQuery) {
        queryBuilder.filter(filterQuery.replace('$filter=', ''));
    }


    if (filterType) {
        context.read('/SAPAssetManager/Services/AssetManager.service', `${context.getPageProxy().binding['@odata.readLink']}/FldLogsWoResvItem_Nav`, [], `${filterQuery}&$orderby=Product`).then(item => {
            const items = item?._array ? item._array : [];
            if (items.length > 0) {
                if (filterType === 'Open') {
                    openItems.push(...items);
                    filterFlag.push('Open');
                } else if (filterType === 'Returned') {
                    returnedItems.push(...items);
                    filterFlag.push('Returned');
                }
            }
        });
    }

    return queryBuilder;
}

/**
 * Get the search query 
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @param {String} searchString 
 * @returns Search Query 
 */
export function getResvItemSearchQuery(context, searchString) {
    let searchQuery = '';
    if (searchString) {
        let searchByProperties = [
            'Product',
            'ReservationItem',
            'Operation',
            'RemoteStorageLocation',
            'PurchaseReq',
            'PurchaseOrd',
            'StorageBin',
        ];
        ModifyListViewSearchCriteria(context, `${context.getPageProxy().binding['@odata.readLink']}/FldLogsWoResvItem_Nav`, searchByProperties);

        searchQuery = `(${libCom.combineSearchQuery(searchString, searchByProperties)})`;


    }
    return searchQuery;
}



/**
 * Create the filter and search query 
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @param {Boolean} addFilterAndSearch 
 * @returns Filter Query with/without filter and search
 */
export function ResvItemListFilterAndSearchQuery(context, addFilterAndSearch = true) {

    const defaultFilterString = '';
    const filterOptions = [];

    if (addFilterAndSearch) {
        filterOptions.push(getCurrentFilters(context));
        if (context.searchString) {
            filterOptions.push(getResvItemSearchQuery(context, context.searchString.toLowerCase()));
        }
    }
    return filterOptions.filter((filterOption => !!filterOption)).reduce((filterString, filterOption) => {
        return libCom.attachFilterToQueryOptionsString(filterString, filterOption);
    }, defaultFilterString);
}

/**
 * Get the current filters for the page
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @returns Currently set filters. In case of page onLoaded event, we should return the preselected filter.
 */
function getCurrentFilters(context) {
    if (libVal.evalIsEmpty(context.getPageProxy().getControls())) {
        return `(${RESVITEM_OPEN_FILTER})`;
    }
    return libCom.getFormattedQueryOptionFromFilter(context);
}

/**
 * Get sort filters for the page
 * @param {import('../../../.typings/IClientAPI').IClientAPI} context 
 * @returns current sorting filters or default sorting filter
 */
function getSortfOptions(context) {
    let result = RESVITEM_DEFAULT_ORDERBY;
    if (context.filters) {
        const sorter = context.filterTypeEnum.Sorter;
        const orderBy = context.filters.filter(v => v.type === sorter).map(fc => fc.filterItems).map(f => f).join(',');
        if (!libVal.evalIsEmpty(orderBy)) {
            result = orderBy;
        }
    }
    return result;
}

