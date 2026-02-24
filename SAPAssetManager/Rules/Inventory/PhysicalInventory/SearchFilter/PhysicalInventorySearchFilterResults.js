import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * Returns the filter values for the PI search page
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of PI search filters
 */
export default function PhysicalInventorySearchFilterResults(context) {
    const filterProps = [
        'Item',
        'ItemCounted',
        'Material',
        'Batch',
        'StorageBin',
    ];
    return libFilter.GetSearchFilterResults(context, filterProps);
}
