import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * Reservation Date Picker search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of Reservation Dates
 */
export default async function ReservationDatePickerItems(context) {
    const entitySet = 'ReservationItems';
    const queryOptions = `$select=RequirementDate&$filter=ReservationNum eq '${context.binding.ReservationNum}'&$orderby=ItemNum`;
    const propName = 'RequirementDate';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
