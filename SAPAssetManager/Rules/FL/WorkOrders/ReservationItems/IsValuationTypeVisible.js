/**
*  Checks if the valuation type is visible for a given product and plant in FL Work Orders.
* @param {IClientAPI} clientAPI
*/

export default function IsValuationTypeVisible(context,product = '', plant = '') {
    product = product || context.binding.Product;
    plant = plant || context.binding.Plant;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialValuations', [], "$filter=(Material eq '" + product + "' and ValuationArea eq '" + plant + "')").then((results) => {
        if (results && results.length > 0) {
            const item = results.getItem(0);
            if (item.ValuationCategory) {
                return Promise.resolve(true);
            }     
        }
       return Promise.resolve(false);
    });
}



