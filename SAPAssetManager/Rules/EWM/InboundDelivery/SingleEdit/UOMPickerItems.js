/**
 * PickerItems for UOM field in EditInboundDeliveryItemPage, based on WarehouseProductUoMs
 * @param {IClientAPI} context 
 * @returns {Promise<Array<{DisplayValue: string, ReturnValue: string}>>}
 */
export default function UOMPickerItems(context) {
    const pageProxy = context.getPageProxy?.() || context;
    const binding = pageProxy.getBindingObject();
    const product = binding?.Product;

    if (!product) {
        return Promise.resolve([]);
    }

    const filter = `$filter=Product eq '${product}'&$select=UoM&$orderby=UoM`;

    return context.read(
        '/SAPAssetManager/Services/AssetManager.service',
        'WarehouseProductUoMs',
        [],
        filter,
    ).then(results => {
        const uniqueUOMs = [...new Set(results.map(row => row.UoM))];
        return uniqueUOMs.map(uom => ({
            DisplayValue: uom,
            ReturnValue: uom,
        }));
    });
}
