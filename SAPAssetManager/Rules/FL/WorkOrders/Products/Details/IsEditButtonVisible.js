import libVal from '../../../../Common/Library/ValidationLibrary';
import IsValuationTypeVisible from '../../ReservationItems/IsValuationTypeVisible';
export default async function IsEditButtonVisible(clientAPI) {
    if (clientAPI.binding.WithdrawnQty) {
        if (Number(clientAPI.binding.WithdrawnQty) === 0) {
            return false;
        }
    }
    if (clientAPI.binding.Status === 'R') {
        return false;
    }
    const isValuated = await IsValuationTypeVisible(clientAPI);
    if (libVal.evalIsNotEmpty(clientAPI.binding.IsBatchManaged) || libVal.evalIsNotEmpty(clientAPI.binding.IsSerialized) || isValuated ) {
        return false;
    }
    return true;
}
