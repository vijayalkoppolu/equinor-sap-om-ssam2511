import FilterLibrary from '../../../Filter/FilterLibrary';

/**
 * Returns the filter values for the Warehouse Task search page
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the filters values for the Warehouse Task search page
 */
export default function WarehouseTaskSearchFilterResults(context) {
    const formCellContainer = context.getControl('FormCellContainer');
    const sortByFilterValue = formCellContainer.getControl('SortFilter').getValue();
    FilterLibrary.formatDescendingSorterDisplayText(sortByFilterValue);

    const filterResults = [
        'WarehouseProcessCategory',
        'WarehouseOrderNumber',
        'WarehouseTask',
        'Product',
        'PurchaseOrderNumber',
        'SourceHU',
        'DestinationHU',
        'SourceBin',
        'DestinationBin',
    ].map((n) => formCellContainer.getControl(n).getFilterValue());
    const leDeliveryNumber = formCellContainer.getControl('LEDeliveryNumber').getValue();
    if (leDeliveryNumber) {
        filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'Delivery', context.localizeText('ewm_le_delivery_number'), [`${leDeliveryNumber}`], false));
    }
    filterResults.push(sortByFilterValue);
    return filterResults;
}
