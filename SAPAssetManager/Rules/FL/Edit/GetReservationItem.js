/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function GetReservationItem(clientAPI) {
    let reservationItem = clientAPI.binding.ReservationItem;
    // Check if the reservationItem contains only zeros
    return /^0+$/.test(reservationItem) ? '' : reservationItem;
}
