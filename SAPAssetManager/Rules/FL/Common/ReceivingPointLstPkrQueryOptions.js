
import libVal from '../../Common/Library/ValidationLibrary';
export default function ReceivingPointLstPkrQueryOptions(clientAPI) {
    return libVal.evalIsNotEmpty(clientAPI.binding.FieldLogisticsTransferPlant) ? `$filter=Plant eq '${clientAPI.binding.FieldLogisticsTransferPlant}'&$orderby=ShippingPoint` : '$orderby=ShippingPoint';
}
