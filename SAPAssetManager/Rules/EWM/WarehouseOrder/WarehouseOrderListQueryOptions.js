import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import EWMLibrary from '../Common/EWMLibrary';
import Logger from '../../Log/Logger';
import FetchRequest from '../../Common/Query/FetchRequest';
import { getSerialNumberSearchQuerySection } from '../WarehouseTask/ListView/WarehouseTaskListQuery';
export const WO_OPEN_FILTER = "WOStatus eq '' or WOStatus eq 'D'";
export const WO_CONFIRMED_FILTER = "WOStatus eq 'C'";
export const WO_DEFAULT_ORDERBY = 'WarehouseOrder';
/**
 * Return data for Warehouse Order List
 * @param {import('../../../.typings/IClientAPI').IClientAPI} context 
 * @returns 
 */
export default function WarehouseOrderListQueryOptions(context) {

    const entitySet = 'WarehouseOrders';
    const queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('WarehouseTask_Nav', 'WarehouseOrderQueue_Nav', 'WarehouseProcessType_Nav', 'WarehouseTask_Nav/WarehouseTaskSerialNumber_Nav');
    queryBuilder.orderBy(getSortfOptions(context));


    try {
        if (!libVal.evalIsEmpty(libCom.getStateVariable(context, 'searchString'))) {
            const searchString = libCom.getStateVariable(context, 'searchString');
            /* In android the searchstring value is not getting set first time and no exception is raised.so we are checking if the value is set or not  */
            context.searchString = libCom.getStateVariable(context, 'searchString');
            if (context.searchString === searchString) {
                libCom.setStateVariable(context, 'searchString', '');
                context.getControl('SectionedTable')?.redraw(true);
            }
        }
    } catch (error) {
        Logger.error('WarehouseOrder', error);
    }

    const filterStr = libCom.getPageName(context) === 'WarehouseOrdersListPage';
    const filterQuery = buildFilterAndSearchQuery(context, true, filterStr);
    if (filterQuery) {
        queryBuilder.filter(filterQuery.replace('$filter=', ''));
    }
    if (libCom.getPageName(context) === 'WarehouseTab') {
        return EWMLibrary.onOverviewPageSectionLoad(context, queryBuilder, filterQuery, 'WarehouseOrders', 2);
    }
    return queryBuilder.build().then(query => {
        let fetchRequest = new FetchRequest(entitySet, query);
        return fetchRequest.execute(context).then(result => {
            context.getPageProxy().setActionBinding(result);
            context.getPageProxy()._context.binding = result;
            return result;
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/EWM/WarehouseOrder.global').getValue(), error);
            return [];
        });
    });
}

/**
 * Build the filter and search query
 * @param {import('../../../.typings/IClientAPI').IClientAPI} context 
 * @returns 
 */
export function buildFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
    let filterOptions = [];
    if (addFilter) {
        filterOptions = [getWarehouseOrderSearchFilters(context)];
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getSearchQuery(context, context.searchString.toLowerCase()));
    }
    return filterOptions.filter(filterOption => !!filterOption)
        .reduce((filterString, filterOption) => libCom.attachFilterToQueryOptionsString(filterString, filterOption), '');
}

/**
 * Return the search query
 * @param {import('../../../.typings/IClientAPI').IClientAPI} context 
 * @param {String} searchString 
 * @returns search query
 */
function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = [
            'WarehouseOrder',
            'ReferenceDoc',
            'Queue',
        ];
        ModifyListViewSearchCriteria(context, 'WarehouseOrder', searchByProperties);
        searchQuery = libCom.combineSearchQuery(searchString, searchByProperties);
        return getCorrectedSearchQuery(context, searchQuery);
    }
    return searchQuery;
}

/**
 * Get the corrected search query with partial string search using `contains` and `any`.
 * @param {IClientAPI} context - The context object.
 * @returns {string} The corrected search query string.
 */
export function getCorrectedSearchQuery(context, searchQuery) {
    const taskProps = [
        'Product',
        'ActivityArea',
        'SourceBin',
        'DestinationBin',
        'ProcCategory',
        'WarehouseTask',
        'DestinationHU',
        'SourceHU',
        'MaintenanceOrder',
        'PurOrder',
        'Delivery',
        'WhseProcType',
    ];
    taskProps.forEach(v => {
        const filterSection = `WarehouseTask_Nav/any(wt:substringof('${context.searchString}', tolower(wt/${v})))`;
        if (searchQuery) {
            searchQuery += ` or ${filterSection}`;
        }
    });
    searchQuery += ` or WarehouseTask_Nav/${getSerialNumberSearchQuerySection(context.searchString)}`;

    return searchQuery;
}

/**
 * Get the Warehouse Order search filters
 * @param {import('../../../.typings/IClientAPI').IClientAPI} context 
 * @returns Currently set filters. In case of page onLoaded event, we should return the preselected filter.
 */
function getWarehouseOrderSearchFilters(context) {
    if (libVal.evalIsEmpty(context.getPageProxy().getControls())) {
        return `(${WO_OPEN_FILTER})`;
    }
    return getCorrectedSearchFilters(context);
}


/**
 * Correct the search string to include the WarehouseTask_Nav entity
 * 
 * Filter caption          Filter field name            => Entity name
 * ProcCategory            'WarehouseProcessCategory'   =>WarehouseTask_Nav
 * WarehouseOrder          'WarehouseOrderNumber'       =>WarehouseOrder
 * ReferenceDoc            'PurchaseOrderNumber'        =>WarehouseOrder
 * Product                 'Product'                    =>WarehouseTask_Nav
 * Delivery                'LEDeliveryNumber'           =>WarehouseOrder
 * WarehouseOrderQueues    'Queue'                      =>WarehouseOrder
 * ActivityArea            'ActivityArea'               =>WarehouseOrder
 * SourceBin               'SourceBin'                  =>WarehouseTask_Nav
 * DestinationBin          'DestinationBin'             =>WarehouseTask_Nav
 * 
 * In order to correct the search string, we need to replace the property that belongs to WarehouseTasks entity with 
 * WarehouseTask_Nav entity with WarehouseTask_Nav/any(wt:wt/ and add a closing bracket ')'
 * Example: the $filter=ProcCategory eq '01' or ProcCategory eq '02' should be corrected to
 * $filter=WarehouseTask_Nav/any(wt:wt/ProcCategory eq '01' or wt/ProcCategory eq '02')
 * 
 * @param {import('../../../.typings/IClientAPI').IClientAPI} context 
 * @returns the corrected search string
 */
function getCorrectedSearchFilters(context) {
    const taskProps = [
        'ProcCategory',
        'Product',
        'SourceBin',
        'DestinationBin',
        'WhseProcType',
    ];

    let searchFilter = libCom.getFormattedQueryOptionFromFilter(context);

    taskProps.forEach(v => {
        const start = searchFilter.indexOf('(' + v);
        if (-1 !== start) {
            const end = searchFilter.indexOf(')', start);
            let filterSection = searchFilter.substring(start, end + 1);
            filterSection = filterSection.replaceAll(v, 'WarehouseTask_Nav/any(wt:wt/' + v).replaceAll(' or ', ') or ') + ')';
            searchFilter = searchFilter.replace(searchFilter.substring(start, end + 1), filterSection);
        }
    });
    return searchFilter;
}

/**
 * Get sort filters for the page
 * @param {import('../../../.typings/IClientAPI').IClientAPI} context 
 * @returns current sorting filters or default sorting filter
 */
function getSortfOptions(context) {
    let result = WO_DEFAULT_ORDERBY;
    if (context.filters) {
        const sorter = context.filterTypeEnum.Sorter;
        const orderBy = context.filters.filter(v => v.type === sorter).map(fc => fc.filterItems).map(f => f).join(',');
        if (!libVal.evalIsEmpty(orderBy)) {
            result = orderBy;
        }
    }
    return result;
}
