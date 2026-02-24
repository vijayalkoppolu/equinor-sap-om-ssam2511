import FilterLibrary from '../../../Filter/FilterLibrary';
import libCommon from '../../../Common/Library/CommonLibrary';
import libFilter from '../../../Inventory/Common/Library/InventoryFilterLibrary';

/**
 * Returns the filter values for the InboundDelivery search page
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns {Array} Array of filter and sort criteria
 */

export default function InboundDeliverySearchFilterResults(context) {
    const formCellContainer = context.getControl('FormCellContainer');
    const sortByFilterValue = formCellContainer.getControl('SortFilter').getValue();
    FilterLibrary.formatDescendingSorterDisplayText(sortByFilterValue);

    const filterProps = [
        'Vendor',
        'PurchaseOrder',
        'WorkOrder',
        'ASN',
        'LEDeliveryNum',
    ];
    const productNames = formCellContainer.getControl('Product').getValue().map(i => i.ReturnValue);
    const productFilterTerms = productNames.map(name => `WarehouseInboundDeliveryItem_Nav/any(i: i/Product eq '${name}')`);
    const filterResults = libFilter.GetSearchFilterResults(context, filterProps);
    const productFilterCriteria = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, productFilterTerms, true, undefined, productNames);
    
    const switchValue = formCellContainer.getControl('PlannedDeliveryDateSwitch').getValue();
    if (switchValue) {
        const dateFilter = libCommon.GetDateIntervalFilterValueDate(
            context,
            context.evaluateTargetPath('#Page:InboundDeliverySearchFilterPage/#ClientData'),
            'InboundDeliverySearchFilterPage',
            'PlannedDeliveryDate',
            'PlannedDeliveryDateSwitch',
            'PlannedDeliveryDateFrom',
            'PlannedDeliveryDateTo',
        );

        if (dateFilter) {
            filterResults.push(dateFilter);
        }
    }
    filterResults.push(productFilterCriteria);
    return filterResults;
}
