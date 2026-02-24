import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import EWMLibrary,{PhysicalInventoryStatus} from '../Common/EWMLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
export const WH_PHYINV_NOTCOUNTED_FILTER =  `PIStatus ne '${PhysicalInventoryStatus.Counted}' and PIStatus ne '${PhysicalInventoryStatus.Recounted}' and PIStatus ne '${PhysicalInventoryStatus.Posted}'`;
export const WH_PHYINV_COUNTED_FILTER =  `PIStatus eq '${PhysicalInventoryStatus.Counted}' or PIStatus eq '${PhysicalInventoryStatus.Recounted}' or PIStatus eq '${PhysicalInventoryStatus.Posted}'`;
/**
* Get the query for the Warehouse Physical Inventory List
* @param {IClientAPI} clientAPI
*/
export default function WHPhysicalInvListQuery(context) {
    const queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('WarehousePhysicalInventory_Nav,WarehousePhysicalInventoryItemSerial_Nav');
    try {
        const searchString = libCom.getStateVariable(context, 'searchString');
         /*Set the string after the page is loaded once */
        if (!libVal.evalIsEmpty(searchString) && context.getPageProxy()._page.isPageHasLoadedOnce ) {
            context.searchString = searchString;
            libCom.setStateVariable(context, 'searchString', '');
            context.getControl('SectionedTable')?.redraw(true);
        }
    } catch (error) {
        Logger.error('PhysicalInventory', error);
    }
    const filterQuery = WHPhysicalInvListFilterAndSearchQuery(context, true, false);
    if (filterQuery) {
        queryBuilder.filter(filterQuery.replace('$filter=', ''));
    }
    if (libCom.getPageName(context) === 'WarehouseTab') {
        return EWMLibrary.onOverviewPageSectionLoad(context, queryBuilder, filterQuery, 'WarehousePhysicalInventoryItems', 2);
    }
    return queryBuilder;
}

/** create the filter and search query for the Warehouse Physical Inventory List */
export function WHPhysicalInvListFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
    const filterOptions = [];
    const warehouseOrder = context.getPageProxy().binding?.WarehouseOrder;
    const defaultFilterString = warehouseOrder ? `$filter=(WarehouseOrder eq '${warehouseOrder}')` : '';
    
    if (addFilter) {
        filterOptions.push(getCurrentFilters(context));
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getWHPhysicalInvSearchQuery(context, context.searchString.toLowerCase()));
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
        return `(${WH_PHYINV_NOTCOUNTED_FILTER})`;
    }
    return libCom.getFormattedQueryOptionFromFilter(context);
}

/**
 * Get the search query for Warehouse Task
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @param {String} searchString 
 * @returns Search Query for Warehouse Task
 */
export function getWHPhysicalInvSearchQuery(context, searchString) {
    let searchQuery = '';
    if (searchString) {
        let searchByProperties = [
            'WarehouseOrder',
            'PIDocumentNo',
            'ITEM_NO',
            'ProductID',
            'ProductDescription',
            'Batch',
        ];
        ModifyListViewSearchCriteria(context, 'WarehousePhysicalInventoryItem', searchByProperties);
        searchQuery = libCom.combineSearchQuery(searchString, searchByProperties);
    }
    return searchQuery;
}

