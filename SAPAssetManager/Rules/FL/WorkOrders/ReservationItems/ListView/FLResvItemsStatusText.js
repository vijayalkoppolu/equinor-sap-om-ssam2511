
export default function FLResvItemsStatusText(clientAPI) {

    return `${clientAPI.binding.WithdrawnQty} ${clientAPI.localizeText('fld_quantity_specifier')} ${clientAPI.binding.RequiredQty} ${clientAPI.binding.BaseUnit}`;

}
