import ComLib from '../../../Common/Library/CommonLibrary';
import { HUDelItemsListFilterAndSearchQuery } from './HUDelItemsOnLoadQuery';

export default function HUDelItemsListCaption(clientAPI) {
    const totalCountQueryOptionsPromise = HUDelItemsListFilterAndSearchQuery(clientAPI);
    const countQueryOptionsPromise = HUDelItemsListFilterAndSearchQuery(clientAPI, true, true);

    return Promise.all([totalCountQueryOptionsPromise, countQueryOptionsPromise])
        .then(([totalCountQueryOptions, countQueryOptions]) => {
            const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsHuDelItems', totalCountQueryOptions);
            const countPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsHuDelItems', countQueryOptions);

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
