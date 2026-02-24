import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * Reservation search filter for the Reservation search page
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns Reservation search filters
 */
export default function ReservationSearchFilterResults(context) {
    const filterProps = [
        'ItemNum',
        'ReservationDate',
        'OrderId',
        'MaterialNum',
        'StorageBin',
        'MovementType'];

    return libFilter.GetSearchFilterResults(context, filterProps);
}


