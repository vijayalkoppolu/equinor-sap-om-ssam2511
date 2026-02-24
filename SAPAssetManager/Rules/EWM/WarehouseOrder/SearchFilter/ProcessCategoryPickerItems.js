/**
 * Get values for ProcessCategory list picker for Orders filter screen
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of ProcessCategory and Description for list picker
 */
export default async function ProcessCategoryPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTasks', [], '$select=WarehouseOrder,ProcCategory,WarehouseProcessCategory_Nav/Description&$expand=WarehouseProcessCategory_Nav&$orderby=WarehouseOrder')
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
