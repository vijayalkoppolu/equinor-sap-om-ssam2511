import libVal from '../../../Common/Library/ValidationLibrary';
import libCom from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';
import EWMLibrary,{InboundDeliveryStatusValue} from '../../Common/EWMLibrary';
import ModifyListViewSearchCriteria from '../../../LCNC/ModifyListViewSearchCriteria';
export const INBOUND_DELIVERY_ITEM_DEFAULT_FILTER = `(GRStatusValue ne '${InboundDeliveryStatusValue.NotRelevant}')`;
export const INBOUND_DELIVERY_ITEM_UNPACKED_FILTER =
    `${INBOUND_DELIVERY_ITEM_DEFAULT_FILTER} and (PackingStatusValue eq '${InboundDeliveryStatusValue.NotStarted}' or PackingStatusValue eq '${InboundDeliveryStatusValue.Partial}') and not (OpenPackableQuantity eq 0 and PackedQuantity eq 0)`;
export const INBOUND_DELIVERY_ITEM_PACKED_FILTER = `${INBOUND_DELIVERY_ITEM_DEFAULT_FILTER} and PackingStatusValue eq '${InboundDeliveryStatusValue.Completed}' and not (OpenPackableQuantity eq 0 and PackedQuantity eq 0)`;
export const INBOUND_DELIVERY_ITEM_NOT_PACKABLE_FILTER = `${INBOUND_DELIVERY_ITEM_DEFAULT_FILTER} and (PackingStatusValue eq '${InboundDeliveryStatusValue.NotRelevant}' or (OpenPackableQuantity eq 0 and PackedQuantity eq 0))`;
export const INBOUND_DELIVERY_ITEM_DEFAULT_ORDERBY = 'WarehouseInboundDelivery_Nav/PlannedDeliveryDate desc,DocumentNumber,ItemNumber';

export default function WHInboundDeliveryItemListQuery(context) {
    const queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('WarehouseInboundDelivery_Nav', 'SerialNumber_Nav');
    queryBuilder.orderBy(INBOUND_DELIVERY_ITEM_DEFAULT_ORDERBY);
    try {
        EWMLibrary.setSearchString(context);
    } catch (error) {
        Logger.error('InboundDelivery', error);
    }
    const filterQuery = WHInboundDeliveryItemFilterAndSearchQuery(context, true, false);
    if (filterQuery) {
        queryBuilder.filter(filterQuery.replace('$filter=', ''));
    }
    if (libCom.getPageName(context) === 'InboundTab') {
        return EWMLibrary.onOverviewPageSectionLoad(context, queryBuilder, filterQuery, 'WarehouseInboundDeliveryItems', 2);
    }
    return queryBuilder;
}

/** create the filter and search query for the Warehouse Inbound Delivery Item List */
export function WHInboundDeliveryItemFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
    const filterOptions = [];
    const inbounddel = context.getPageProxy()?.binding?.EWMDeliveryNum;
    let defaultFilterString = `$filter=(${INBOUND_DELIVERY_ITEM_DEFAULT_FILTER})`;

    if (inbounddel) {
        defaultFilterString += ` and (DocumentNumber eq '${inbounddel}')`;
    }
    if (addFilter) {
        filterOptions.push(getCurrentFilters(context));
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getWHInboundDeliveryItemSearchQuery(context, context.searchString.toLowerCase()));
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
        return `(${INBOUND_DELIVERY_ITEM_UNPACKED_FILTER})`;
    }
    return libCom.getFormattedQueryOptionFromFilter(context);
}

/**
 * Get the search query for Inbound Delivery Items
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @param {String} searchString 
 * @returns Search Query Inbound Delivery Items
 */
export function getWHInboundDeliveryItemSearchQuery(context, searchString) {
    let searchQuery = '';
    if (searchString) {
        let searchByProperties = [
            'DocumentNumber',
            'ItemNumber',
            'Product',
            'DescStockType',
            'BatchNumber',
        ];
        ModifyListViewSearchCriteria(context, 'WarehouseInboundDeliveryItem', searchByProperties);
        searchQuery = libCom.combineSearchQuery(searchString, searchByProperties);
    }
    return searchQuery;
}
