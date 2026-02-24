import ComLib from '../../Common/Library/CommonLibrary';
import { VoyagesListFilterAndSearchQuery } from './VoyagesOnLoadQuery';

export default function VoyagesListCaption(clientAPI) {
    const totalCountQueryOptionsPromise = VoyagesListFilterAndSearchQuery(clientAPI);
    const countQueryOptionsPromise = VoyagesListFilterAndSearchQuery(clientAPI, true, true);

    return Promise.all([totalCountQueryOptionsPromise, countQueryOptionsPromise])
    .then(([totalCountQueryOptions, countQueryOptions]) => {
        const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsVoyages', totalCountQueryOptions);
        const countPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsVoyages', countQueryOptions);

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
