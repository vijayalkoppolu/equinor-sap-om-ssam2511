import libFilter from '../../Common/Library/InventoryFilterLibrary';

/**
 * Reservation StorageBin Picker for search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of StorageBins
 */
export default async function ReservationStorageBinPickerItems(context) {
    const entitySet = 'ReservationItems';
    const queryOptions = `$select=ItemNum,StorageBin&$filter=ReservationNum eq '${context.binding.ReservationNum}'&$orderby=ItemNum`;
    const propName = 'StorageBin';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
