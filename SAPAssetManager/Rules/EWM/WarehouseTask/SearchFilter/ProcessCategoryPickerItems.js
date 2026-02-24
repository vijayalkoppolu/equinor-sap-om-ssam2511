import { GetWarehouseTaskEntitySet } from './WarehouseTaskPickerItems';

/**
 * Get values for ProcessCategory list picker for Tasks filter screen
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of ProcessCategory and Description for list picker
 */
export default async function ProcessCategoryPickerItems(context) {
    const entityset = GetWarehouseTaskEntitySet(context);
    return context.read('/SAPAssetManager/Services/AssetManager.service', entityset, [], '$expand=WarehouseProcessCategory_Nav&$select=ProcCategory,WarehouseProcessCategory_Nav/Description&$orderby=WarehouseTask')
        .then(o => {
            return [...new Map(o.map(row => {
                const key = iter => iter.ProcCategory;
                return [key(row), row];
            })).values()].map(v => (
                {
                    'ReturnValue': `${v.ProcCategory}`,
                    'DisplayValue': `${v.WarehouseProcessCategory_Nav.Description}`,
                }
            ));
        });
}
