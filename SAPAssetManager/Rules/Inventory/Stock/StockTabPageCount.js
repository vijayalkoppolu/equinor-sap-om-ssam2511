import MaterialsSearchQueryOptions from './MaterialsSearchQueryOptions';
export default function StockTabPageCount(clientAPI) {
    return clientAPI.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialSLocs', '').then(totalCount => {
        const queryString = MaterialsSearchQueryOptions(clientAPI, true);
        return clientAPI.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialSLocs', queryString).then(count => {
            if (count === totalCount) {
                return clientAPI.localizeText('stock_x', [count || 0]);
            } else {
                return clientAPI.localizeText('stock_x_x', [count || 0, totalCount || 0]);
            }
        });
    });
}
