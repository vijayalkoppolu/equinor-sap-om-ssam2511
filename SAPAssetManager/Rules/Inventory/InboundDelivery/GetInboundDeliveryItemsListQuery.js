import libCom from '../../Common/Library/CommonLibrary';
import setCaption from '../Search/InventorySearchSetCaption';
import setCaptionState from '../Common/SetCaptionStateForListPage';
import { getFilterQuery } from '../OutboundDelivery/GetOutboundDeliveryItemsListQuery';
export default function GetInboundDeliveryListQuery(context, queryOnly = false, caption = true) {
    let searchString = context.searchString;
    let filter = '';
    let filters = [];
    let queryBuilder;
    const sectionedTable = context.getPageProxy().getControls()[0];
    let deliveryNum = context.binding?.DeliveryNum || sectionedTable?.binding?.DeliveryNum;
    let baseQuery = "(DeliveryNum eq '" + deliveryNum + "')";
    const baseQueryInitial = baseQuery; // Store initial base query for filters
    let expand = 'InboundDelivery_Nav,InboundDeliverySerial_Nav,MaterialPlant_Nav';
    let orderby = 'Item';

    let tabFilters = context?.filters || sectionedTable?.filters;
    let tabGroups;
    if (tabFilters) {
        tabGroups = tabFilters.flatMap(val => val.filterItems[0]);
        if (tabGroups && tabGroups.includes('Quantity gt -1') && !tabGroups.includes('Quantity gt -2')) {
            baseQuery = baseQuery + ' and (PickedQuantity ne Quantity)';
        } else if (tabGroups && !tabGroups.includes('Quantity gt -1') && tabGroups.includes('Quantity gt -2')) {
            baseQuery = baseQuery + ' and (PickedQuantity eq Quantity)';
        }
    }

    if (queryOnly) {
        return '$filter=' + baseQuery + '&$expand=' + expand + '&$orderby=' + orderby;
    }

    queryBuilder = context?.dataQueryBuilder?.() || sectionedTable?.dataQueryBuilder();
    libCom.setStateVariable(context, 'INVENTORY_CAPTION', 'IDI');
    libCom.setStateVariable(context, 'INVENTORY_BASE_QUERY', '$filter=' + baseQuery);
    libCom.setStateVariable(context, 'INVENTORY_ENTITYSET', 'InboundDeliveryItems');
    libCom.setStateVariable(context, 'INVENTORY_LIST_PAGE', 'InboundDeliveryItemsListPage');

    if (searchString) { //Supporting order number and material number for searches
        searchString = context.searchString.toLowerCase();
        filters.push(`substringof('${searchString}', tolower(Plant))`);
        filters.push(`substringof('${searchString}', tolower(Material))`);
        filters.push(`substringof('${searchString}', tolower(Material_Nav/Description))`);
    }
    if (filters.length > 0) {
        filter = baseQuery + ' and (' + filters.join(' or ') + ')';
    } else {
        filter = baseQuery;
    }
    const filterQuery =  getFilterQuery(context, baseQueryInitial);
    if (filterQuery) {
        // Remove $filter= and replace & with ' and '
        const cleanedFilter = filterQuery.replace('$filter=', '').replace(/&/g, ' and ');
        queryBuilder.filter(cleanedFilter);
    }
    queryBuilder.filter(filter);
    queryBuilder.expand(expand);
    queryBuilder.orderBy(orderby);
    libCom.setStateVariable(context, 'INVENTORY_SEARCH_FILTER', filter);

    setCaptionState(context, libCom.getPageName(context)); //Save caption state for this list page

    //If this script was called because a filter was just applied, do not run setCaption here
    if (!libCom.getStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED') && caption) {
        return setCaption(context).then(() => {
            return queryBuilder;
        });
    }
    libCom.removeStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED');
    return queryBuilder;

}
