
export default function FormatResvItemsFootNote(context) {
if (context.binding.PurchaseReq && context.binding.PurchaseOrd ) {
    return `${context.binding.PurchaseReq} - ${context.binding.PurchaseOrd}`;

} else if (context.binding.PurchaseReq !== '') {
    return `${context.binding.PurchaseReq}`;
} else if (context.binding.PurchaseOrd !== '') {
    return `${context.binding.PurchaseOrd}`;
} else return '';
}
