import CommonLibrary from '../../Common/Library/CommonLibrary';
import { PackedPackagesFilterAndSearchQuery } from './PackedPackagesOnLoadQuery';

export default function PackedPackagesCountCaption(clientAPI) {
    const totalCountQueryOptionsPromise = PackedPackagesFilterAndSearchQuery(clientAPI);
    const countQueryOptionsPromise = PackedPackagesFilterAndSearchQuery(clientAPI, true, true);
    
    return Promise.all([totalCountQueryOptionsPromise, countQueryOptionsPromise])
        .then(([totalCountQueryOptions, countQueryOptions]) => {
            const totalCountPromise = CommonLibrary.getEntitySetCount(clientAPI, 'FldLogsPackCtnPkdPkgs', totalCountQueryOptions);
            const countPromise = CommonLibrary.getEntitySetCount(clientAPI, 'FldLogsPackCtnPkdPkgs', countQueryOptions);

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

