/**
 * Warehouse Order Number Picker Items for Warehouse Task search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of Warehouse Order numbers
 */
export default async function WarehouseOrderNumberPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTasks', [], '$select=WarehouseOrder&$orderby=WarehouseOrder')
        .then(o => [... new Set(Array.from(o, c => c.WarehouseOrder))]
        .map(uniqueValue => ({
            'DisplayValue': `${uniqueValue}`,
            'ReturnValue': `${uniqueValue}`,
        })));
}
