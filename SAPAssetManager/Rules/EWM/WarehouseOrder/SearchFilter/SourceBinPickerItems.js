/**
 * 
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of Products
 */
export default async function SourceBinPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTasks', [], '$orderby=WarehouseOrder')
        .then(o => [... new Set(Array.from(o, c => c.SourceBin))]
        .map(uniqueValue => ({
            'DisplayValue': `${uniqueValue}`,
            'ReturnValue': `${uniqueValue}`,
        })));
}
