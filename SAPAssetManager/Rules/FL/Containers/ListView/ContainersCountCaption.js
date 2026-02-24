import ComLib from '../../../Common/Library/CommonLibrary';
import { ContainersListFilterAndSearchQuery } from './ContainersListQueryOptions';

export default function ContainersCountCaption(clientAPI) {
    const totalCountQueryOptionsPromise = ContainersListFilterAndSearchQuery(clientAPI);
    const countQueryOptionsPromise = ContainersListFilterAndSearchQuery(clientAPI, true, true);

    return Promise.all([totalCountQueryOptionsPromise, countQueryOptionsPromise])
        .then(([totalCountQueryOptions, countQueryOptions]) => {
            const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsContainers', totalCountQueryOptions);
            const countPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsContainers', countQueryOptions);

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
