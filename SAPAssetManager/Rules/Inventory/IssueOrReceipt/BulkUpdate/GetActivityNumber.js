import { GetFirstOpenItemForDocument } from './BulkUpdateLibrary';
import { getActivityNumberFromItem } from '../GetActivityNumber';

export default function GetActivityNumber(context) {
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    return GetFirstOpenItemForDocument(context, type, context.binding).then(item => {
        return getActivityNumberFromItem(item);
    });
}
