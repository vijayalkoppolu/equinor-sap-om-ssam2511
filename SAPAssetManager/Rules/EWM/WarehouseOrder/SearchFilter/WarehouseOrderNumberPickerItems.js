/**
 * Warehouse Order Number Picker Items for Warehouse Order search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of Warehouse Order numbers
 */
export default async function WarehouseOrderNumberPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseOrders', [], '$orderby=WarehouseOrder')
        .then(o => [... new Set(Array.from(o, c => c.WarehouseOrder))]
        .map(uniqueValue => ({
            'DisplayValue': `${uniqueValue}`,
            'ReturnValue': `${uniqueValue}`,
        })));
}
