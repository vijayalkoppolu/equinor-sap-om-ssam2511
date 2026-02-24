import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * Reservation Order Picker for search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of Reservation Orders
 */
export default async function ReservationOrderPickerItems(context) {
    const entitySet = 'ReservationItems';
    const queryOptions = `$select=OrderId&$filter=ReservationNum eq '${context.binding.ReservationNum}'&$orderby=ItemNum`;
    const propName = 'OrderId';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
