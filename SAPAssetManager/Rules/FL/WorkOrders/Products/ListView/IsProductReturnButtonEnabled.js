
import libVal from '../../../../Common/Library/ValidationLibrary';
import IsValuationTypeVisible from '../../ReservationItems/IsValuationTypeVisible';
export default async function IsResvItemReturnButtonEnabled(clientAPI) {

    if (clientAPI.binding.WithdrawnQty) {
        if (Number(clientAPI.binding.WithdrawnQty) === 0) {
            return '';
        }
    }
    if (clientAPI.binding.Status === 'R') {
        return '';
    }
    const isValuated = await IsValuationTypeVisible(clientAPI);
    if (libVal.evalIsNotEmpty(clientAPI.binding.IsBatchManaged) || libVal.evalIsNotEmpty(clientAPI.binding.IsSerialized) || isValuated ) {
        return '';
    }
    return 'sap-icon://write-new';
}
