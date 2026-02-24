/**
* Returns an array of tag objects for a work order product.
* @param {IClientAPI} context
*/
export default function WorkOrderTags(clientAPI) {
    const tags = [];
    if (clientAPI.binding.SupplyProcess) {
        tags.push({
            Text: clientAPI.localizeText('fl_prd_supply_process', [clientAPI.binding.SupplyProcess]),
        });
    }
    return tags;
}
