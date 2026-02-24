import autoOpenMovementScreen from '../Search/AutoOpenMovementScreen';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import FilterLibrary from '../Common/Library/InventoryFilterLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';
import FetchRequest from '../../Common/Query/FetchRequest';

const DEFAULT_ORDERBY = 'ItemNum';

/**
 * Build queries for PO, STO, PRD and RS items
 * @param {IClientAPI} context PO, STO, PRD or RS objects
 * @returns DataQueryBuilder
 */
export default function GetItemsListQuery(context) {
    const sectionedTable = context.getPageProxy().getControls()[0];
    const type = context.binding['@odata.type']?.substring('#sap_mobile.'.length) || sectionedTable.binding['@odata.type']?.substring('#sap_mobile.'.length);
    /** @type {DataQueryBuilder} */
    const queryBuilder = context?.dataQueryBuilder?.() || sectionedTable.dataQueryBuilder();
    
    const ItemsListQuery = {
        PurchaseOrderHeader: getPurchaseOrderItemsQuery,
        StockTransportOrderHeader: getSTOItemsQuery,
        PurchaseRequisitionHeader: getPRItemsQuery,
        ReservationHeader: getReservationItemsQuery,
        ProductionOrderHeader: getPRDItemsQuery,
    }[type];

    return ItemsListQuery(context, queryBuilder, context.searchString?.toLowerCase());
}

/**
 * Handler for Purchase Order Items
 * @param {IClientAPI} context 
 * @param {DataQueryBuilder} queryBuilder 
 * @param {String} searchString 
 * @returns 
 */
function getPurchaseOrderItemsQuery(context, queryBuilder, searchString) {
    queryBuilder.orderBy(FilterLibrary.GetSortfOptions(context, DEFAULT_ORDERBY));
    const purchaseOrder = context.binding?.PurchaseOrderId || context.getPageProxy().getControl('SectionedTable').binding.PurchaseOrderId;
    queryBuilder.filter("(PurchaseOrderId eq '" + purchaseOrder + "')");
    queryBuilder.expand('MaterialPlant_Nav', 'ScheduleLine_Nav', 'PurchaseOrderHeader_Nav', 'POSerialNumber_Nav', 'MaterialDocItem_Nav/PurchaseOrderItem_Nav', 'MaterialDocItem_Nav/SerialNum', 'ScheduleLine_Nav', 'Material_Nav');
   
    const searchFilters = FilterLibrary.GetCorrectedSearchFilters(context, ['DeliveryDate'], 'ScheduleLine_Nav').replaceAll(`${FilterLibrary.LAMBDA_QUERY_PREFIX}DeliveryDate eq `, 'wt:wt/DeliveryDate eq datetime');
    if (ValidationLibrary.evalIsNotEmpty(searchFilters)) {
        queryBuilder.filter(searchFilters);
    }
    addQuantityFilters(context, queryBuilder);
    addSearchStringFilters(queryBuilder, searchString);
    autoOpenMovementScreen(context, 'PurchaseOrderItems', queryBuilder, searchString);
    return prepareBinding(context, queryBuilder, 'PurchaseOrderItems');
}

/**
 * Handler for Stock Transport Order Items
 * @param {IClientAPI} context 
 * @param {DataQueryBuilder} queryBuilder 
 * @param {String} searchString 
 * @returns 
 */
function getSTOItemsQuery(context, queryBuilder, searchString) {
    const sectionedTable = context.getPageProxy().getControl('SectionedTable');
    const stockTransportOrderId = context.binding?.StockTransportOrderId || sectionedTable?.binding.StockTransportOrderId;
    queryBuilder.orderBy(FilterLibrary.GetSortfOptions(context, DEFAULT_ORDERBY));
    queryBuilder.filter("(StockTransportOrderId eq '" + stockTransportOrderId + "')");
    queryBuilder.expand('MaterialPlant_Nav', 'StockTransportOrderHeader_Nav', 'STOScheduleLine_Nav', 'STOSerialNumber_Nav', 'MaterialDocItem_Nav/SerialNum', 'MaterialDocItem_Nav/StockTransportOrderItem_Nav');

    const searchFilters = FilterLibrary.GetCorrectedSearchFilters(context, ['DeliveryDate'], 'STOScheduleLine_Nav').replaceAll(`${FilterLibrary.LAMBDA_QUERY_PREFIX}DeliveryDate eq `, 'wt:wt/DeliveryDate eq datetime');
    if (ValidationLibrary.evalIsNotEmpty(searchFilters)) {
        queryBuilder.filter(searchFilters);
    }

    let plant = CommonLibrary.getDefaultUserParam('USER_PARAM.WRK');
    let tabFilters = context?.filters || sectionedTable?.filters;
    let tabGroups;
    let appFilter;
    if (tabFilters) {
        tabGroups = tabFilters.map(val => val.filterItems[0]);
        if (tabGroups && tabGroups.includes('1 gt -1') && !tabGroups.includes('2 gt -2')) {
            appFilter = getAppFilterForFirstGroup(plant, context);
            queryBuilder.filter(appFilter);
        } else if (tabGroups && !tabGroups.includes('1 gt -1') && tabGroups.includes('2 gt -2')) {
            appFilter = getAppFilterForSecondGroup(plant, context);
            queryBuilder.filter(appFilter);
        }
    }
    if (searchString) {
        let searchStringFilters = [
            `substringof('${searchString}', tolower(ItemText))`,
            `substringof('${searchString}', tolower(ItemNum))`,
            `substringof('${searchString}', tolower(MaterialNum))`,
            `substringof('${searchString}', tolower(Plant))`,
            `substringof('${searchString}', tolower(StockType))`,
            `substringof('${searchString}', tolower(StorageLoc))`,
            `STOScheduleLine_Nav/any(wp : substringof('${searchString}', tolower(wp/Batch)) and (wp/ScheduleLine eq '0001'))`,
            `MaterialPlant_Nav/MaterialSLocs/any(wp : substringof('${searchString}', tolower(wp/StorageBin)) and (wp/StorageLocation eq StorageLoc))`,
            `substringof('${searchString}', tolower(Material_Nav/Description))`,
        ];
        queryBuilder.filter('(' + searchStringFilters.join(' or ') + ')');
    }
    autoOpenMovementScreen(context, 'StockTransportOrderItems', queryBuilder, searchString);
    return prepareBinding(context, queryBuilder, 'StockTransportOrderItems');
}

/**
 * Add filters for open and closed items
 * @param {IClientAPI} context 
 * @param {QueryBuilder} queryBuilder 
 */
function addQuantityFilters(context, queryBuilder) {
    let appFilter;
    const filters = context?.filters || context.getPageProxy().getControls()[0]?.filters;
    if (filters) {
        const tabGroups = filters.map(val => val.filterItems[0]);
        if (tabGroups && tabGroups.includes('1 gt -1') && !tabGroups.includes('2 gt -2')) {
            appFilter = "((OpenQuantity gt 0) and (FinalDeliveryFlag ne 'X'))";
            queryBuilder.filter(appFilter);
        } else if (tabGroups && !tabGroups.includes('1 gt -1') && tabGroups.includes('2 gt -2')) {
            appFilter = "((OpenQuantity eq 0) or (FinalDeliveryFlag eq 'X'))";
            queryBuilder.filter(appFilter);
        }
    }
}

/**
 * Add search string filters
 * @param {IClientAPI} context 
 * @param {QueryBuilder} queryBuilder 
 */
function addSearchStringFilters(queryBuilder, searchString) {
    if (searchString) {
        const searchStringFilters = [
            `substringof('${searchString}', tolower(PurchaseOrderHeader_Nav/SupplyingPlant))`,
            `substringof('${searchString}', tolower(PurchaseOrderHeader_Nav/Vendor_Nav/Name1))`,
            `substringof('${searchString}', tolower(MaterialNum))`,
            `substringof('${searchString}', tolower(StorageLoc))`,
            `substringof('${searchString}', tolower(Plant))`,
            `substringof('${searchString}', tolower(StockType))`,
            `substringof('${searchString}', tolower(ItemNum))`,
            `substringof('${searchString}', tolower(ItemText))`,        
            `ScheduleLine_Nav/any(wp : substringof('${searchString}', tolower(wp/Batch)) and (wp/ScheduleLine eq '0001'))`,
            `MaterialPlant_Nav/MaterialSLocs/any(wp : substringof('${searchString}', tolower(wp/StorageBin)) and (wp/StorageLocation eq StorageLoc))`,
            `substringof('${searchString}', tolower(Material_Nav/Description))`,
        ];
        queryBuilder.filter('(' + searchStringFilters.join(' or ') + ')');
    }
}

/**
 * Execute the query and set the action binding
 * @param {IClientAPI} context 
 * @param {QueryBuilder} queryBuilder 
 * @param {String} entitySet 
 * @returns read results
 */
function prepareBinding(context, queryBuilder, entitySet) {
    return queryBuilder.build().then(query => {
        const fetchRequest = new FetchRequest(entitySet, query);
        return fetchRequest.execute(context).then(result => {
            context.getPageProxy().setActionBinding(result);
            context.getPageProxy()._context.binding = result;
            return result;
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/Inventory/InventoryItemList.global').getValue(), error);
            return [];
        });
    });
}

/**
 * Builds app filter for the 1st group
 * @param {String} plant 
 * @param {IClientAPI} context 
 * @returns 
 */
function getAppFilterForFirstGroup(plant, context) {
    let appFilter;
    const supplyingPlant = context.binding?.SupplyingPlant || context.getPageProxy().getControl('SectionedTable').binding?.SupplyingPlant;
    if (plant && plant === supplyingPlant) {
        appFilter = "(((OrderQuantity eq IssuedQuantity) and (IssuedQuantity eq 0)) or ((OrderQuantity gt IssuedQuantity) and (FinalDeliveryFlag ne 'X' and DeliveryCompletedFlag ne 'X')))";
    } else {
        appFilter = "(((OrderQuantity eq ReceivedQuantity) and (ReceivedQuantity eq 0)) or ((OrderQuantity gt ReceivedQuantity) and (FinalDeliveryFlag ne 'X' and DeliveryCompletedFlag ne 'X')))";
    }
    return appFilter;
}

/**
 * Builds app filter for the 2nd group
 * @param {String} plant 
 * @param {IClientAPI} context 
 * @returns 
 */
function getAppFilterForSecondGroup(plant, context) {
    let appFilter;
    const supplyingPlant = context.binding?.SupplyingPlant || context.getPageProxy().getControl('SectionedTable').binding?.SupplyingPlant;
    if (plant && plant === supplyingPlant) {
        appFilter = "(((OrderQuantity eq IssuedQuantity) and (IssuedQuantity ne 0)) or ((OrderQuantity gt IssuedQuantity) and (FinalDeliveryFlag eq 'X' or DeliveryCompletedFlag eq 'X')))";
    } else {
        appFilter = "(((OrderQuantity eq ReceivedQuantity) and (ReceivedQuantity ne 0)) or ((OrderQuantity gt ReceivedQuantity) and (FinalDeliveryFlag eq 'X' or DeliveryCompletedFlag eq 'X')))";
    }
    return appFilter;
}

function getReservationItemsQuery(context, queryBuilder, searchString) {
    const sectionedTable = context.getPageProxy().getControl('SectionedTable');
    const reservationNum = context.binding?.ReservationNum || sectionedTable?.binding.ReservationNum;
    queryBuilder.orderBy(FilterLibrary.GetSortfOptions(context, DEFAULT_ORDERBY));
    queryBuilder.filter("(ReservationNum eq '" + reservationNum + "')");
    queryBuilder.expand('MaterialPlant_Nav/Material', 'ReservationHeader_Nav', 'MaterialDocItem_Nav');
    const searchFilters = CommonLibrary.getFormattedQueryOptionFromFilter(context);
    if (ValidationLibrary.evalIsNotEmpty(searchFilters)) {
        queryBuilder.filter(searchFilters);
    }
    if (searchString) {
        let searchStringFilters = [
            `substringof('${searchString}', tolower(ItemNum))`,
            `substringof('${searchString}', tolower(MaterialNum))`,
            `substringof('${searchString}', tolower(Batch))`,
            `substringof('${searchString}', tolower(StorageBin))`,
            `substringof('${searchString}', tolower(SupplyPlant))`,
            `substringof('${searchString}', tolower(SupplyStorageLocation))`,
            `substringof('${searchString}', tolower(RecordType))`,
            `substringof('${searchString}', tolower(MaterialPlant_Nav/Material/Description))`,
        ];
        queryBuilder.filter('(' + searchStringFilters.join(' or ') + ')');
    }
    return autoOpenMovementScreen(context, 'ReservationItems', queryBuilder, searchString);
}

function getPRDItemsQuery(context, queryBuilder, searchString) {
    const orderId = context.binding?.OrderId || context.getPageProxy().getControl('SectionedTable').binding.OrderId;
    queryBuilder.orderBy(FilterLibrary.GetSortfOptions(context, DEFAULT_ORDERBY));
    queryBuilder.filter("(OrderId eq '" + orderId + "')");
    queryBuilder.expand('Material_Nav', 'ProductionOrderSerial_Nav', 'ProductionOrderHeader_Nav', 'MaterialPlant_Nav', 'MaterialDocItem_Nav');
    const searchFilters = CommonLibrary.getFormattedQueryOptionFromFilter(context);
    if (ValidationLibrary.evalIsNotEmpty(searchFilters)) {
        queryBuilder.filter(searchFilters);
    }
    if (searchString) {
        let searchStringFilters = [
            `substringof('${searchString}', tolower(ItemNum))`,
            `substringof('${searchString}', tolower(MaterialNum))`,
            `substringof('${searchString}', tolower(Material_Nav/Description))`,
        ];
        queryBuilder.filter('(' + searchStringFilters.join(' or ') + ')');
    }
    return autoOpenMovementScreen(context, 'ProductionOrderItems', queryBuilder, searchString);
}

function getPRItemsQuery(context, queryBuilder, searchString) {
    const purchaseReqNo = context.binding?.PurchaseReqNo || context.getPageProxy().getControls()[0].binding.PurchaseReqNo;
    queryBuilder.orderBy(FilterLibrary.GetSortfOptions(context, 'PurchaseReqItemNo'));
    queryBuilder.filter("(PurchaseReqNo eq '" + purchaseReqNo + "')");
    queryBuilder.expand('PurchaseRequisitionLongText_Nav,PurchaseRequisitionAddress_Nav,PurchaseRequisitionAcctAsgn_Nav,PurchaseRequisitionHeader_Nav');
    if (searchString) {
        let searchStringFilters = [
            `substringof('${searchString}', tolower(PurchaseReqItemNo))`,
            `substringof('${searchString}', tolower(Plant))`,
            `substringof('${searchString}', tolower(StorageLocation))`,
            `substringof('${searchString}', tolower(ShortText))`,
            `substringof('${searchString}', tolower(Material))`,
        ];
        queryBuilder.filter('(' + searchStringFilters.join(' or ') + ')');
    }
    return autoOpenMovementScreen(context, 'PurchaseRequisitionItems', queryBuilder, searchString);
}

