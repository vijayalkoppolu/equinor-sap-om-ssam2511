import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { VoyagesListFilterAndSearchQuery } from '../VoyagesOnLoadQuery';

export default function IsSelectItemsButtonActive(clientAPI) {
    const countQueryOptionsPromise = VoyagesListFilterAndSearchQuery(clientAPI, false, true);
    
    return countQueryOptionsPromise
        .then((countQueryOptions) => {
            const countPromise = CommonLibrary.getEntitySetCount(clientAPI, 'FldLogsVoyages', countQueryOptions);
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
