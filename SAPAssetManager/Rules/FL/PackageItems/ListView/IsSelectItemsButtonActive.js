import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { PackageItemsListFilterAndSearchQuery } from '../PackageItemsOnLoadQuery';

export default function FLIsSelectItemsButtonActive(clientAPI) {
    const countQueryOptions = PackageItemsListFilterAndSearchQuery(clientAPI, false, true);
    
    return CommonLibrary.getEntitySetCount(clientAPI, 'FldLogsPackageItems', countQueryOptions)
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

