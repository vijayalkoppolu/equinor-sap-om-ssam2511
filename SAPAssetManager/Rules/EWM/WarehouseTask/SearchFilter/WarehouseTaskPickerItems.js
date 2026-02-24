/**
 * Warehouse Task Picker Items for Warehouse Task search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of Warehouse Order numbers
 */
export default async function WarehouseTaskPickerItems(context) {
    const entityset = GetWarehouseTaskEntitySet(context);
    return context.read('/SAPAssetManager/Services/AssetManager.service', entityset, [], '$select=WarehouseTask&$orderby=WarehouseTask')
        .then(o => [... new Set(Array.from(o, c => c.WarehouseTask))]
        .map(uniqueValue => ({
            'DisplayValue': `${uniqueValue}`,
            'ReturnValue': `${uniqueValue}`,
        })));
}

export function GetWarehouseTaskEntitySet(context) {
    const binding = context.binding;
    return binding ? `${binding['@odata.readLink']}/WarehouseTask_Nav` : 'WarehouseTasks';
}
