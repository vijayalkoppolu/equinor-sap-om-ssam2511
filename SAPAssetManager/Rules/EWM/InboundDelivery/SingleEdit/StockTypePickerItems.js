/**
 * PickerItems for StockType field in EditInboundDeliveryItemPage,
 * based on WarehouseStockTypes entity set
 * @param {IClientAPI} context 
 * @returns {Promise<Array<{DisplayValue: string, ReturnValue: string}>>}
 */
export default function StockTypePickerItems(context) {
    return context.read(
        '/SAPAssetManager/Services/AssetManager.service',
        'WarehouseStockTypes',
        [],
        '$orderby=StockType',
    ).then(results => {
        const uniqueTypes = [...new Set(results.map(r => r.StockType))];

        return uniqueTypes.map(type => ({
            DisplayValue: type,
            ReturnValue: type,
        }));
    });
}
