import libVal from '../../Common/Library/ValidationLibrary';
export default async function ReturnToStockReadLink(clientAPI) {
    if (clientAPI.binding['@odata.readLink'].includes('FldLogsWoProducts')) {
        let product = clientAPI.binding.Product;
        let order = clientAPI.binding.Order;
        const query = `$filter=Product eq '${product}' and Order eq '${order}'`;

        return await clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsWoResvItems', [], query).then(function(result) {
            if (!libVal.evalIsEmpty(result)) {
                let ri = result.getItem(0);
                return ri['@odata.readLink'];
            }
            return '';
        });

    } else if (clientAPI.binding['@odata.readLink'].includes('FldLogsWoResvItems')) {
         let product = clientAPI.binding.Product;
         let order = clientAPI.binding.Order;
        const query = `$filter=Product eq '${product}' and Order eq '${order}'`;

        return await clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsWoProducts', [], query).then(function(result) {
            if (!libVal.evalIsEmpty(result)) {
                let pr = result.getItem(0);
                return pr['@odata.readLink'];
            }
            return '';
        });
    }
}

