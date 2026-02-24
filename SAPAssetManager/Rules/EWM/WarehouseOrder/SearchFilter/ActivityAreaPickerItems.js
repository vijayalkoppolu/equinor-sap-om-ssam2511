/**
 * Returns the list of unique ActivityArea values from the WarehouseOrders entityset
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of ActivityAreas
 */
export default async function ActivityAreaPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseOrders', [], '$orderby=WarehouseOrder')
        .then(o => [... new Set(Array.from(o, c => c.ActivityArea))]
        .map(uniqueValue => ({
            'DisplayValue': `${uniqueValue}`,
            'ReturnValue': `${uniqueValue}`,
        })));
}
