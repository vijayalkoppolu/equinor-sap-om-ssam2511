import CommonLibrary from '../../../../Common/Library/CommonLibrary';
import { ResvItemListFilterAndSearchQuery } from './FLResvItemsListViewQuery';

export default function FLIsSelectItemsButtonActive(clientAPI) {
    const countQueryOptions = ResvItemListFilterAndSearchQuery(clientAPI, true);
    
    CommonLibrary.getEntitySetCount(clientAPI, `${clientAPI.getPageProxy().binding['@odata.readLink']}/FldLogsWoResvItem_Nav`, countQueryOptions)
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
