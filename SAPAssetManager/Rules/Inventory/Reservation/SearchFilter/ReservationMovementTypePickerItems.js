import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * Reservation Movement Types Picker for search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of Reservation Movement Types
 */
export default async function ReservationMovementTypePickerItems(context) {
    const entitySet = 'ReservationItems';
    const queryOptions = `$select=MovementType&$filter=ReservationNum eq '${context.binding.ReservationNum}'&$orderby=ItemNum`;
    const propName = 'MovementType';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
