/**
* Get Manufacturing Part and EAN Numbers
* @param {IClientAPI} clientAPI
*/
export default function GetManufacturingPart(clientAPI) {
    const binding = clientAPI.binding;
    const parts = [];

    if (binding.ManufacturerPartNum) {
        parts.push(clientAPI.localizeText('fld_manufacturer_part_no_x', [binding.ManufacturerPartNum]));
    }
    if (binding.EanUpc) {
        parts.push(clientAPI.localizeText('fld_ean_no_x', [binding.EanUpc]));
    }

    return parts.join(' / ');
}
