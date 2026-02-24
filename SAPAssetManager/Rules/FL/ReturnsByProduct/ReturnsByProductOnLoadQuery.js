import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

export const PRODUCTS_DEFAULT_ORDERBY = 'Product';

export const PRODUCT_DEFAULT_ATREMOTE = "FldLogsReturnStatus eq '10'";
export const PRODUCT_DEFAULT_RET_SCHED = "FldLogsReturnStatus eq '30'";
export const PRODUCT_DEFAULT_READY_DISP = "FldLogsReturnStatus eq '40'";
export const PRODUCT_DEFAULT_DISPATCH = "FldLogsReturnStatus eq '50'";

/**
 * Build the List Query
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @returns Filter Query 
 */
export let openItems, atRemoteItems, schedItems, rdyDispatchItems, dispatchItems = [];
export let returnedItems = [];
export let filterFlag = [];
export default function ReturnsByProductOnLoadQuery(context) {
    const queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('FldLogsReturnStatus_Nav', 'FldLogsSupproc_Nav', 'FldLogsRecommendedAction_Nav', 'FldLogsRefDocType_Nav', 'FldLogsRefDocType_Nav', 'FldLogsShippingPoint_Nav');
    queryBuilder.orderBy('Product');
    let filterType = '';
    if (context.filters) {
        switch (context?.filters[0]?._filterItems[0]) {
            case PRODUCT_DEFAULT_ATREMOTE:
                filterType = 'AtRemoteStatus';
                break;
            case PRODUCT_DEFAULT_RET_SCHED:
                filterType = 'ReturnScheduledStatus';
                break;
            case PRODUCT_DEFAULT_READY_DISP:
                filterType = 'ReadyForDispatchStatus';
                break;
            case PRODUCT_DEFAULT_DISPATCH:
                filterType = 'DispatchedStatus';
                break;
            default:
                filterType = 'AtRemoteStatus';
        }

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
        Logger.error('ReturnProducts', error);
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
            'FldLogsInitRetProducts',
            [],
            `${filterQuery}&$orderby=${orderBy}`,
        ).then(item => {
            const items = item?._array ? item._array : [];
            libCom.setStateVariable(context, 'RETPRODUCTS_ARRAY', items);
            if (items.length > 0) {
                if (filterType === 'AtRemoteStatus') {
                    atRemoteItems.push(...items);
                    filterFlag.push('ReturnScheduledStatus');
                } else if (filterType === 'ReturnScheduledStatus') {
                    schedItems.push(...items);
                    filterFlag.push('ReturnScheduledStatus');
                } else if (filterType === 'ReadyForDispatchStatus') {
                    rdyDispatchItems.push(...items);
                    filterFlag.push('ReadyForDispatchStatus');
                } else if (filterType === 'DispatchedStatus') {
                    dispatchItems.push(...items);
                    filterFlag.push('DispatchedStatus');
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

        let searchByProperties = ['Product', 'FldLogsReferenceDocCategory', 'FldLogsReferenceDocumentNumber', 'FldLogsRecommendedAction_Nav/FldLogsRecommendedActionText', 'FldLogsSupplyProcess', 'SupplyingStorageLocation', 'FieldLogisticsTransferPlant'];
        ModifyListViewSearchCriteria(context, 'FldLogsInitRetProducts', searchByProperties);
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
        return `(${PRODUCT_DEFAULT_ATREMOTE})`;
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


