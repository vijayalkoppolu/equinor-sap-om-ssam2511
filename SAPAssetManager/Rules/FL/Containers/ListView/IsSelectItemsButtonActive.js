import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { ContainersListFilterAndSearchQuery } from './ContainersListQueryOptions';

export default function FLIsSelectItemsButtonActive(clientAPI) {
    const countQueryOptionsPromise = ContainersListFilterAndSearchQuery(clientAPI, false, true);
    
    return countQueryOptionsPromise
        .then((countQueryOptions) => {
            const countPromise = CommonLibrary.getEntitySetCount(clientAPI, 'FldLogsContainers', countQueryOptions);
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
