import ComLib from '../../Common/Library/CommonLibrary';
import { ContainerItemsListFilterAndSearchQuery } from './ContainerItemsListQueryOptions';

export default function ContainerItemsCountCaption(clientAPI) {
    const totalCountQueryOptions = ContainerItemsListFilterAndSearchQuery(clientAPI);
    const countQueryOptions = ContainerItemsListFilterAndSearchQuery(clientAPI, true, true);

    const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsContainerItems', totalCountQueryOptions);
    const countPromise = ComLib.getEntitySetCount(clientAPI, 'FldLogsContainerItems', countQueryOptions);

    return Promise.all([countPromise, totalCountPromise]).then(([count, totalCount]) => {
        if (count === totalCount) {
            return clientAPI.localizeText('items_x', [totalCount]);
        }
        return clientAPI.localizeText('items_x_x', [count, totalCount]);
    });
}
