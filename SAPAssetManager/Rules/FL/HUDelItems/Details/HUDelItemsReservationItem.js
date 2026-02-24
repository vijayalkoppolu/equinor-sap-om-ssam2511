import { HideZeroValues} from '../../../Inventory/MaterialDocumentItem/MovementTypeFieldMDI';

export default function HUDelItemsReservationItem(context) {
    return HideZeroValues(context.binding.ReservationItem);
}
