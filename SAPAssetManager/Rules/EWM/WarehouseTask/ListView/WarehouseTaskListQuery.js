import ModifyListViewSearchCriteria from '../../../LCNC/ModifyListViewSearchCriteria';
import libVal from '../../../Common/Library/ValidationLibrary';
import libCom from '../../../Common/Library/CommonLibrary';
import EWMLibrary, { WarehouseTaskStatus } from '../../Common/EWMLibrary';
import Logger from '../../../Log/Logger';

export const WAREHOUSE_TASKS_OPEN_FILTER = `WTStatus eq '${WarehouseTaskStatus.Open}' or WTStatus eq '${WarehouseTaskStatus.Waiting}'`;
export const WAREHOUSE_TASKS_CONFIRMED_FILTER = `WTStatus eq '${WarehouseTaskStatus.Confirmed}'`;
export const WAREHOUSE_TASKS_DEFAULT_ORDERBY = 'WarehouseTask';

/**
 * Build the Warehouse Task List Query
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @returns Filter Query for Warehouse Task
 */
export let openItems = [];
export let confirmedItems = [];
export let filterFlag = [];
export default function WarehouseTaskListQuery(context) {
    const queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('WarehouseTaskConfirmation_Nav', 'WarehouseTaskSerialNumber_Nav', 'WarehouseProcessCategory_Nav', 'WarehouseProcessType_Nav');
    queryBuilder.orderBy(getSortfOptions(context));
    let filterType = '';
    if (context.filters) {
        filterType = context?.filters[0]?._filterItems[0] === WAREHOUSE_TASKS_OPEN_FILTER ? 'Open' : 'Confirmed';
    }
    openItems.length = 0;
    confirmedItems.length = 0;
    filterFlag.length = 0;
    try {
        if (!libVal.evalIsEmpty(libCom.getStateVariable(context, 'searchString'))) {
            const searchString = libCom.getStateVariable(context, 'searchString');
            context.searchString = libCom.getStateVariable(context, 'searchString');
/* In android the searchstring value is not getting set first time and no exception is raised.so we are checking if the value is set or not  */
            if (context.searchString === searchString) {
                libCom.setStateVariable(context, 'searchString', '');
                context.getControl('SectionedTable')?.redraw(true);
            }
        }
    } catch (error) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/EWM/WarehouseTask.global').getValue(), error);
    }

    const addFilterAndSearch = context.evaluateTargetPathForAPI('#Page:-Current').currentPage.definition.name !== 'EWMOverviewPage';
    const filterQuery = WarehouseTaskListFilterAndSearchQuery(context, addFilterAndSearch);

    if (filterQuery) {
        queryBuilder.filter(filterQuery.replace('$filter=', ''));
    }
    if (libCom.getPageName(context) === 'WarehouseTab') {
        return EWMLibrary.onOverviewPageSectionLoad(context, queryBuilder, filterQuery, 'WarehouseTasks', 2);
    }

    if (filterType) {
        context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTasks', [], `${filterQuery}&$orderby=WarehouseTask`).then( item =>{
            const items = item?._array ? item._array : [];
            if (items.length>0) {
                if (filterType === 'Open') { 
                    openItems.push(...items);
                    filterFlag.push('Open');
                } else if (filterType === 'Confirmed') {
                    confirmedItems.push(...items);
                    filterFlag.push('Confirmed');
                }
            }
        });
    }

    return queryBuilder;
}

/**
 * Get the search query for Warehouse Task
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @param {String} searchString 
 * @returns Search Query for Warehouse Task
 */
export function getWarehouseTaskSearchQuery(context, searchString) {
    let searchQuery = '';
    if (searchString) {
        let searchByProperties = [
            'WarehouseTask', 
            'Product', 
            'SourceHU', 
            'DestinationHU', 
            'SourceBin', 
            'DestinationBin', 
            'ActivityArea', 
            'ProcCategory', 
            'MaintenanceOrder', 
            'PurOrder', 
            'Delivery',
            'ProductDescription',
        ];
        ModifyListViewSearchCriteria(context, 'WarehouseTask', searchByProperties);
        searchQuery = `(${libCom.combineSearchQuery(searchString, searchByProperties)} or ${getSerialNumberSearchQuerySection(searchString)})`;
    }
    return searchQuery;
}

export function getSerialNumberSearchQuerySection(searchString) {
    return `WarehouseTaskSerialNumber_Nav/any(sn: substringof('${searchString}', sn/SerialNumber))`;
}

/**
 * Create the filter and search query for Warehouse Task
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @param {Boolean} addFilterAndSearch 
 * @returns Filter Query for Warehouse Task with/without filter and search
 */
export function WarehouseTaskListFilterAndSearchQuery(context, addFilterAndSearch = true, binding = context.getPageProxy().binding) {

    let defaultFilterString = '';
    const filterOptions = [];
    const parentpage = binding?.['@odata.type'];
    
    if (parentpage === '#sap_mobile.WarehouseInboundDeliveryItem') {
        const itembinding = binding || context.binding;
        const inboundDelivery = itembinding?.DocumentNumber;
        const inboundDeliveryItem = itembinding?.ItemNumber.replace(/^0+/, '');
        defaultFilterString = `$filter=(EWMInbDel eq '${inboundDelivery}' and EWMInbDelItem eq '${inboundDeliveryItem}')`;

    } else if (parentpage === '#sap_mobile.WarehouseOrder') {
        const warehouseOrder = binding?.WarehouseOrder;
        defaultFilterString = `$filter=(WarehouseOrder eq '${warehouseOrder}')`;
    }

    if (addFilterAndSearch) {
        filterOptions.push(getCurrentFilters(context));
        if (context.searchString) {
            filterOptions.push(getWarehouseTaskSearchQuery(context, context.searchString.toLowerCase()));
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
        return `(${WAREHOUSE_TASKS_OPEN_FILTER})`;
    }
    return libCom.getFormattedQueryOptionFromFilter(context);
}

/**
 * Get sort filters for the page
 * @param {import('../../../.typings/IClientAPI').IClientAPI} context 
 * @returns current sorting filters or default sorting filter
 */
function getSortfOptions(context) {
    let result = WAREHOUSE_TASKS_DEFAULT_ORDERBY;
    if (context.filters) {
        const sorter = context.filterTypeEnum.Sorter;
        const orderBy = context.filters.filter(v => v.type === sorter).map(fc => fc.filterItems).map(f => f).join(',');
        if (!libVal.evalIsEmpty(orderBy)) {
            result = orderBy;
        }
    }
    return result;
}
