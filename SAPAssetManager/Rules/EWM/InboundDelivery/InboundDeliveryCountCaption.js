import ComLib from '../../Common/Library/CommonLibrary';
import { InboundDeliveryListFilterAndSearchQuery } from './InboundDeliveryListQuery';

/**
 * Get the caption for the Inbound Deliveries count
 * @param {IClientAPI} clientAPI
 */
export default function InboundDeliveryCountCaption(clientAPI) {
    const totalCountQueryOptions = InboundDeliveryListFilterAndSearchQuery(clientAPI);
    const countQueryOptions = InboundDeliveryListFilterAndSearchQuery(clientAPI, true, true);

    const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'WarehouseInboundDeliveries', totalCountQueryOptions);
    const countPromise = ComLib.getEntitySetCount(clientAPI, 'WarehouseInboundDeliveries', countQueryOptions);

    return Promise.all([countPromise, totalCountPromise]).then(([count, totalCount]) => {
        if (count === totalCount) {
            return clientAPI.localizeText('items_x', [totalCount]);
        }
        return clientAPI.localizeText('items_x_x', [count, totalCount]);
    });
}
