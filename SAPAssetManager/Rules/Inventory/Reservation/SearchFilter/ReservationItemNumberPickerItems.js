import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * Reservation Items Number Picker for search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of Reservation Item numbers
 */
export default async function ReservationItemNumberPickerItems(context) {
    const entitySet = 'ReservationItems';
    const queryOptions = `$select=ItemNum&$filter=ReservationNum eq '${context.binding.ReservationNum}'&$orderby=ItemNum`;
    const propName = 'ItemNum';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
