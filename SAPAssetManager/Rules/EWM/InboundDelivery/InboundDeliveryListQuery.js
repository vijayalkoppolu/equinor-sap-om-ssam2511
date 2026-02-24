import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import { InboundDeliveryStatusValue } from '../Common/EWMLibrary';
import EWMLibrary from '../Common/EWMLibrary';

/**
 * Get the query for the Inbound Delivery List
 * @param {IClientAPI} context
 */
export default function InboundDeliveryListQuery(context) {
    const queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('WarehouseInboundDeliveryItem_Nav');
    try {
        EWMLibrary.setSearchString(context);
    } catch (error) {
        Logger.error('InboundDelivery', error);
    }

    const searchQuery = InboundDeliveryListFilterAndSearchQuery(context, true);
    if (searchQuery) {
        queryBuilder.filter(searchQuery.replace('$filter=', ''));
    }
    queryBuilder.orderBy('PlannedDeliveryDate desc');

    if (libCom.getPageName(context) === 'InboundTab') {
        return EWMLibrary.onOverviewPageSectionLoad(context, queryBuilder, searchQuery, 'WarehouseInboundDeliveries', 2);
    }

    return queryBuilder;
}
/** create the filter and search query for the Inbound Delivery List */
export function InboundDeliveryListFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
    const filterOptions = [];

    if (addFilter) {
        const filterString = libCom.getFormattedQueryOptionFromFilter(context);
        if (filterString) {
            filterOptions.push(filterString);
        }
    }
    filterOptions.push(`GRStatusValue ne '${InboundDeliveryStatusValue.NotRelevant}'`);

    if (addSearch && context.searchString) {
        filterOptions.push(getInboundDeliverySearchQuery(context, context.searchString.toLowerCase()));
    }

    return filterOptions.filter((filterOption => !!filterOption)).reduce((filterString, filterOption) => {
        return libCom.attachFilterToQueryOptionsString(filterString, filterOption);
    }, '');
}
/**
 * Get the search query for Inbound Deliveries
 */
function getInboundDeliverySearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = [
            'EWMDeliveryNum',
            'Vendor',
            'PurchaseOrder',
            'WarehouseNum',
            'PackingStatus',
            'LEDeliveryNum',
        ];
        ModifyListViewSearchCriteria(context, 'WarehouseInboundDelivery', searchByProperties);
        searchQuery = libCom.combineSearchQuery(searchString, searchByProperties);
    }
    return searchQuery;
}
