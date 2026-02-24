import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { ReadyToPackListFilterAndSearchQuery } from '../ReadyToPackOnLoadQuery';

export default function FLIsSelectItemsButtonActive(clientAPI) {
    const countQueryOptionsPromise = ReadyToPackListFilterAndSearchQuery(clientAPI, false, true);
    
    return countQueryOptionsPromise
        .then((countQueryOptions) => {
            const countPromise = CommonLibrary.getEntitySetCount(clientAPI, 'FldLogsPackCtnRdyPcks', countQueryOptions);
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
