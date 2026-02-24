import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { ContainerItemsListFilterAndSearchQuery } from '../ContainerItemsListQueryOptions';

export default function FLIsSelectItemsButtonActive(clientAPI) {
    const countQueryOptions = ContainerItemsListFilterAndSearchQuery(clientAPI, false, true);
    
    return CommonLibrary.getEntitySetCount(clientAPI, 'FldLogsContainerItems', countQueryOptions)
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
