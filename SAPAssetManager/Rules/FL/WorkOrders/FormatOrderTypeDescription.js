/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default async function FormatOrderTypeDescription(clientAPI) {
    const tags = [];
    const orderTypes = await clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=PlanningPlant eq '${clientAPI.binding.Plant}' and OrderType eq '${clientAPI.binding.OrderType}'`);
    let desc = clientAPI.binding.OrderType;
    if (orderTypes.getItem(0)) {
        desc = orderTypes.getItem(0).OrderTypeDesc;
    }
    tags.push({ Text: desc });
    return tags;
}
