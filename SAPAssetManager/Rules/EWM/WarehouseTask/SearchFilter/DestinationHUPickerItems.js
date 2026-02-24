import { GetWarehouseTaskEntitySet } from './WarehouseTaskPickerItems';

/**
 * Returns HU Picker Items
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of HUs
 */
export default async function DestinationHUPickerItems(context) {
    const entityset = GetWarehouseTaskEntitySet(context);
    return context.read('/SAPAssetManager/Services/AssetManager.service', entityset, [], '$orderby=WarehouseTask')
        .then(o => [... new Set(Array.from(o, c => c.DestinationHU))]
        .map(uniqueValue => ({
            'DisplayValue': `${uniqueValue}`,
            'ReturnValue': `${uniqueValue}`,
        })));
}
