import ComLib from '../../Common/Library/CommonLibrary';
import { PackedContainersListFilterAndSearchQuery } from './PackedContainersOnLoadQuery';

export default function PackedContainersCountCaption(clientAPI) {
    const totalCountQueryOptionsPromise = PackedContainersListFilterAndSearchQuery(clientAPI);
    const countQueryOptionsPromise = PackedContainersListFilterAndSearchQuery(clientAPI, true, true);

    return Promise.all([totalCountQueryOptionsPromise, countQueryOptionsPromise])
        .then(([totalCountQueryOptions, countQueryOptions]) => {
            const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsPackCtnPkdCtns', totalCountQueryOptions);
            const countPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsPackCtnPkdCtns', countQueryOptions);

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
