import { GetWarehouseTaskEntitySet } from './WarehouseTaskPickerItems';

/**
 * Source Bin Picker Items 
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of Products
 */
export default async function SourceBinPickerItems(context) {
    const entityset = GetWarehouseTaskEntitySet(context);
    return context.read('/SAPAssetManager/Services/AssetManager.service', entityset, [], '$orderby=WarehouseOrder')
        .then(o => [... new Set(Array.from(o, c => c.SourceBin))]
        .map(uniqueValue => ({
            'DisplayValue': `${uniqueValue}`,
            'ReturnValue': `${uniqueValue}`,
        })));
}
