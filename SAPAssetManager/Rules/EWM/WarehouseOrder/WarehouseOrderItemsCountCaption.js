import ComLib from '../../Common/Library/CommonLibrary';
import { buildFilterAndSearchQuery } from './WarehouseOrderListQueryOptions';
/**
* @param {IClientAPI} clientAPI
*/
export default function WarehouseOrderItemsCountCaption(clientAPI) {
    const totalCountQueryOptions = buildFilterAndSearchQuery(clientAPI);
    const countQueryOptions = buildFilterAndSearchQuery(clientAPI, true, true);

    const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'WarehouseOrders', totalCountQueryOptions);
    const countPromise = ComLib.getEntitySetCount(clientAPI, 'WarehouseOrders', countQueryOptions);

    return Promise.all([countPromise, totalCountPromise]).then(([count, totalCount]) => {
        if (count === totalCount) {
            return clientAPI.localizeText('items_x', [totalCount]);
        }
        return clientAPI.localizeText('items_x_x', [count, totalCount]);
    });   
}
