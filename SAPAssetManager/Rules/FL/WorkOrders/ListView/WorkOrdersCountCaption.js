import ComLib from '../../../Common/Library/CommonLibrary';
import { WorkOrdersListFilterAndSearchQuery } from '../WorkOrdersOnLoadQuery';

export default function WorkOrdersCountCaption(clientAPI) {
    const totalCountQueryOptionsPromise = WorkOrdersListFilterAndSearchQuery(clientAPI);
    const countQueryOptionsPromise = WorkOrdersListFilterAndSearchQuery(clientAPI, true, true);

    return Promise.all([totalCountQueryOptionsPromise, countQueryOptionsPromise])
        .then(([totalCountQueryOptions, countQueryOptions]) => {
            const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsWorkOrders', totalCountQueryOptions);
            const countPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsWorkOrders', countQueryOptions);

            return Promise.all([countPromise, totalCountPromise]);
        })
    .then(([count, totalCount]) => {
        if (count === totalCount) {
            return clientAPI.localizeText('items_x', [totalCount]);
        }
        return clientAPI.localizeText('items_x_x', [count, totalCount]);
    })
    .catch(error => {
        throw error;
    });
}
