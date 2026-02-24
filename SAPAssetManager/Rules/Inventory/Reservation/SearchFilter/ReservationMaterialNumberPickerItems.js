import libFilter from '../../Common/Library/InventoryFilterLibrary';

/**
 * Reservation Material Number Picker search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of material numbers
 */
export default async function ReservationrMaterialNumberPickerItems(context) {
        const entitySet = 'ReservationItems';
        const queryOptions = `$select=MaterialNum&$filter=ReservationNum eq '${context.binding.ReservationNum}'&$orderby=ItemNum`;
        const propName = 'MaterialNum';
        return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
