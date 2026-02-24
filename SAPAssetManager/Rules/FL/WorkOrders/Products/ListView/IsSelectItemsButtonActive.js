import CommonLibrary from '../../../../Common/Library/CommonLibrary';
import { ProductListFilterAndSearchQuery } from '../../../ReturnsByProduct/ReturnsByProductOnLoadQuery';

export default function FLIsSelectItemsButtonActive(clientAPI) {
    const countQueryOptions = ProductListFilterAndSearchQuery(clientAPI, true);
    
    CommonLibrary.getEntitySetCount(clientAPI, `${clientAPI.getPageProxy().binding['@odata.readLink']}/FldLogsWoProduct_Nav`, countQueryOptions)
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
