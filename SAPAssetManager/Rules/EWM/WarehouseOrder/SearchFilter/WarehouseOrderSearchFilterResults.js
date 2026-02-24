import FilterLibrary from '../../../Filter/FilterLibrary';

/**
 * Returns the filter values for the Warehouse Order search page
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the filters values for the Warehouse Order search page
 */
export default function WarehouseOrderSearchFilterResults(context) {
    const formCellContainer = context.getControl('FormCellContainer');
    const sortByFilterValue = formCellContainer.getControl('SortFilter').getValue();
    FilterLibrary.formatDescendingSorterDisplayText(sortByFilterValue);

    const filterResults = [
        'WarehouseProcessCategory',
        'WarehouseOrderNumber',
        'PurchaseOrderNumber',
        'Product',
        'Queue',
        'ActivityArea',
        'SourceBin',
        'DestinationBin',
    ].map((n) => formCellContainer.getControl(n).getFilterValue());
    const leDeliveryNumber = formCellContainer.getControl('LEDeliveryNumber').getValue();
    if (leDeliveryNumber) {
        filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'ReferenceDoc', context.localizeText('ewm_le_delivery_number'), [`${leDeliveryNumber}`], false));
    }
    filterResults.push(sortByFilterValue);
    return filterResults;
}
