import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * Returns the filter values for the Purchase Order search page
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of Reservation search filters
 */
export default function PurchaseOrderSearchFilterResults(context) {
    const filterProps = [
        'ItemNum',
        'MaterialNum',
        'StorageBin',
        'DeliveryDueDate',
        'CostCenter',
        'GLAccount',
        'Order',
    ];
    return libFilter.GetSearchFilterResults(context, filterProps);
}
