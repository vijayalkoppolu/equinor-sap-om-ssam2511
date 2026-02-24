import ComLib from '../../Common/Library/CommonLibrary';
import { ReadyToPackListFilterAndSearchQuery } from './ReadyToPackOnLoadQuery';

export default function ReadyToPackCountCaption(clientAPI) {
    const totalCountQueryOptionsPromise = ReadyToPackListFilterAndSearchQuery(clientAPI);
    const countQueryOptionsPromise = ReadyToPackListFilterAndSearchQuery(clientAPI, true, true);

    return Promise.all([totalCountQueryOptionsPromise, countQueryOptionsPromise])
        .then(([totalCountQueryOptions, countQueryOptions]) => {
            const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsPackCtnRdyPcks', totalCountQueryOptions);
            const countPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsPackCtnRdyPcks', countQueryOptions);

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
