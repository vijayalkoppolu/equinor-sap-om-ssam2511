
export default function FLProductsStatusText(clientAPI) {
 return `${clientAPI.binding.WithdrawnQty.toString()} ${clientAPI.localizeText('fld_quantity_specifier')} ${clientAPI.binding.RequiredQty} ${clientAPI.binding.BaseUnit}`;
}
