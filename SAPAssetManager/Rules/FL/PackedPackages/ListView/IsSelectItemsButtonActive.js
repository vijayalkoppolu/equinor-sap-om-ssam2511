import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { PackedPackagesFilterAndSearchQuery } from '../PackedPackagesOnLoadQuery';

export default function FLIsSelectItemsButtonActive(clientAPI) {
    const countQueryOptionsPromise = PackedPackagesFilterAndSearchQuery(clientAPI, false, true);
    
    return countQueryOptionsPromise
        .then((countQueryOptions) => {
            const countPromise = CommonLibrary.getEntitySetCount(clientAPI, 'FldLogsPackCtnPkdPkgs', countQueryOptions);
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
