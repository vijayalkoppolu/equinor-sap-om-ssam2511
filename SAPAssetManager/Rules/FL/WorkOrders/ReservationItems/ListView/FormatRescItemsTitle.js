

export default function FormatResvItemsSubHead(context) {
   
if (context.binding.ReservationItem && context.binding.Product ) {
    return `${Number(context.binding.ReservationItem)} - ${context.binding.Product}`;

} else if (context.binding.ReservationItem !== '') {
    return `${Number(context.binding.ReservationItem)}`;
} else if (context.binding.Product !== '') {
    return `${context.binding.Product}`;
} else return '';
}
