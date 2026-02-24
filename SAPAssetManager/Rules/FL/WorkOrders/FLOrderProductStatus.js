import libVal from '../../Common/Library/ValidationLibrary';
import { FldLogsWOProductStatus } from '../Common/FLLibrary';
export default function FLOrderProductStatus(clientAPI) {

    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', clientAPI.binding['@odata.readLink'], [], '$expand=FldLogsWoResvItem_Nav').then((results) => {
        if (!libVal.evalIsEmpty(results) ) {
            const items = results.getItem(0).FldLogsWoResvItem_Nav || [];
            const currentCount = items.map(row => row.Status === FldLogsWOProductStatus.Returned ? 1 : 0).reduce((sum, n) => sum + n, 0);
            const totalCount = Array.isArray(items) ? items.length : 0;
            return ((totalCount === currentCount) ? clientAPI.localizeText('fl_wo_product_status_returned') : clientAPI.localizeText('open'));
        }
        return '';
    });
}
