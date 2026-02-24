/**
 * Returns the filter values for the Purchase Order search page
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the filters values for the Purchase Order search page
 */
export default function StockTransportOrderSearchFilterResults(context) {
    const formCellContainer = context.getControl('FormCellContainer');
    const sortByFilterValue = formCellContainer.getControl('SortFilter').getValue();
    const filterResults = [
        'ItemNum',
        'MaterialNum',
        'StorageBin',
        'DeliveryDueDate',
    ].map((n) => formCellContainer.getControl(n).getFilterValue());
    filterResults.push(sortByFilterValue);
    return filterResults;
}

