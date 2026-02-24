import CommonLibrary from '../../Common/Library/CommonLibrary';
import { PackageItemsListFilterAndSearchQuery } from './PackageItemsOnLoadQuery';

export default function PackageItemsListCaption(clientAPI) {
    const totalCountQueryOptions = PackageItemsListFilterAndSearchQuery(clientAPI);
    const countQueryOptions = PackageItemsListFilterAndSearchQuery(clientAPI, true, true);

    const totalCountPromise = CommonLibrary.getEntitySetCount(clientAPI, 'FldLogsPackageItems', totalCountQueryOptions);
    const countPromise = CommonLibrary.getEntitySetCount(clientAPI, 'FldLogsPackageItems', countQueryOptions);

    return Promise.all([countPromise, totalCountPromise]).then(([count, totalCount]) => {
        if (count === totalCount) {
            return clientAPI.localizeText('items_x', [totalCount]);
        }
        return clientAPI.localizeText('items_x_x', [count, totalCount]);
    });
}
