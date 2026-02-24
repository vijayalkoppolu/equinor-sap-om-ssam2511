import libFilter from '../Common/Library/InventoryFilterLibrary';
/**
 * Returns the filter values for the IBD and OBD search page
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of Reservation search filters
 */
export default function InboundOutboundSearchFilterResults(context) {
    const filterProps = [
        'Item',
        'StorageBin',
    ];
    return libFilter.GetSearchFilterResults(context, filterProps);
}

