
export default function FormatReturnableQuantity(clientAPI) {
    return `${clientAPI.binding.RetblQtyInBaseUnit} ${clientAPI.binding.RetblQtyBaseUnit}`;
}
