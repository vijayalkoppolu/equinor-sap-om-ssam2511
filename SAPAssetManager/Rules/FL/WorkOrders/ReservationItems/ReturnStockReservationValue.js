
export default function ReturnStockReservationValue(context) {
    if (context.binding.Reservation) {
        return context.binding.Reservation.toString().padStart(10, '0');
    } else 
    return '';
}
