import { HideZeroValues} from '../../../Inventory/MaterialDocumentItem/MovementTypeFieldMDI';

export default function HUDelItemsReservation(context) {
    return HideZeroValues(context.binding.Reservation);
}
