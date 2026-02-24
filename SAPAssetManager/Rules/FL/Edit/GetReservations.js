/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function GetReservations(clientAPI) {
    let reservation = clientAPI.binding.Reservation;
    // Check if the reservationItem contains only zeros
    return /^0+$/.test(reservation) ? '' : reservation;
}
