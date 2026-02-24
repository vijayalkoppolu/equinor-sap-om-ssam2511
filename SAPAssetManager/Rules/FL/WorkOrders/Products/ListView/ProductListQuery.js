
import ModifyListViewSearchCriteria from '../../../../LCNC/ModifyListViewSearchCriteria';
import libVal from '../../../../Common/Library/ValidationLibrary';
import libCom from '../../../../Common/Library/CommonLibrary';
import Logger from '../../../../Log/Logger';

export const PRODUCTS_OPEN_FILTER = "Status eq ''";
export const PRODUCTS_RETURNED_FILTER = "Status eq 'R'";
export const PRODUCTS_DEFAULT_ORDERBY = 'Product';

/**
 * Build the List Query
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @returns Filter Query 
 */
export let openItems = [];
export let returnedItems = [];
export let filterFlag = [];
export default function ProductListQuery(context) {
    const queryBuilder = context.dataQueryBuilder();
    queryBuilder.orderBy(getSortfOptions(context));
    openItems.length = 0;
    returnedItems.length = 0;
    filterFlag.length = 0;
    let filterType = '';
    if (context.filters) {
        filterType = context?.filters[0]?._filterItems[0] === PRODUCTS_OPEN_FILTER ? 'Open' : 'Returned';
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
        Logger.error('PhysicalInventory', error);
    }

    const addFilterAndSearch = true;
    const filterQuery = ProductListFilterAndSearchQuery(context, addFilterAndSearch);

    if (filterQuery) {
        queryBuilder.filter(filterQuery.replace('$filter=', ''));
    }


    if (filterType) {
        const orderBy = getSortfOptions(context);
        context.read(
            '/SAPAssetManager/Services/AssetManager.service',
            `${context.getPageProxy().binding['@odata.readLink']}/FldLogsWoProduct_Nav`,
            [],
            `${filterQuery}&$orderby=${orderBy}`,
        ).then(item => {
            const items = item?._array ? item._array : [];
            libCom.setStateVariable(context, 'PRODUCTS_ARRAY', items);
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
export function getProductSearchQuery(context, searchString) {
    let searchQuery = '';
    if (searchString) {
        let searchByProperties = [
            'Product',
            'SupplyProcess',
            'Operation',
        ];
        ModifyListViewSearchCriteria(context, `${context.getPageProxy().binding['@odata.readLink']}/FldLogsWoProduct_Nav`, searchByProperties);

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
export function ProductListFilterAndSearchQuery(context, addFilterAndSearch = true) {

    const defaultFilterString = '';
    const filterOptions = [];

    if (addFilterAndSearch) {
        filterOptions.push(getCurrentFilters(context));
        if (context.searchString) {
            filterOptions.push(getProductSearchQuery(context, context.searchString.toLowerCase()));
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
        return `(${PRODUCTS_OPEN_FILTER})`;
    }
    return libCom.getFormattedQueryOptionFromFilter(context);
}

/**
 * Get sort filters for the page
 * @param {import('../../../.typings/IClientAPI').IClientAPI} context 
 * @returns current sorting filters or default sorting filter
 */
function getSortfOptions(context) {
    let result = PRODUCTS_DEFAULT_ORDERBY;
    if (context.filters) {
        const sorter = context.filterTypeEnum.Sorter;
        const orderBy = context.filters.filter(v => v.type === sorter).map(fc => fc.filterItems).map(f => f).join(',');
        if (!libVal.evalIsEmpty(orderBy)) {
            result = orderBy;
        }
    }
    return result;
}

