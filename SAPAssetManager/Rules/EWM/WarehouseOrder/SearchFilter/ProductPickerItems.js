/**
 * 
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of Products
 */
export default async function ProductPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTasks', [], '$orderby=WarehouseTask')
        .then(o => [... new Set(Array.from(o, c => c.Product))]
        .map(uniqueValue => ({
            'DisplayValue': `${uniqueValue}`,
            'ReturnValue': `${uniqueValue}`,
        })));
}
