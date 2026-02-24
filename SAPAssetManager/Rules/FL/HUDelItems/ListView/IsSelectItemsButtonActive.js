import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { HUDelItemsListFilterAndSearchQuery } from './HUDelItemsOnLoadQuery';

export default function FLIsSelectItemsButtonActive(clientAPI) {
    const countQueryOptionsPromise = HUDelItemsListFilterAndSearchQuery(clientAPI, false, true);
    
    return countQueryOptionsPromise
        .then((countQueryOptions) => {
            const countPromise = CommonLibrary.getEntitySetCount(clientAPI, 'FldLogsHuDelItems', countQueryOptions);
            return countPromise;
        })
        .then((count) => {
            if (count > 0) {
                return true;
            }
            return false;
        })
        .catch(error => {
            throw error;
        });
}
