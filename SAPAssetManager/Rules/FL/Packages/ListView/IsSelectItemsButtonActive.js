import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { PackagesListFilterAndSearchQuery } from '../PackagesOnLoadQuery';

export default function FLIsSelectItemsButtonActive(clientAPI) {
    const countQueryOptionsPromise = PackagesListFilterAndSearchQuery(clientAPI, false, true);
    
    return countQueryOptionsPromise
        .then((countQueryOptions) => {
            const countPromise = CommonLibrary.getEntitySetCount(clientAPI, 'FldLogsPackages', countQueryOptions);
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

