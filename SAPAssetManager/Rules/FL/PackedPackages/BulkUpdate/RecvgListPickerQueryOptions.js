
import libVal from '../../../Common/Library/ValidationLibrary';
export default function RecvgListPickerQueryOptions(clientAPI) {
    return libVal.evalIsNotEmpty(clientAPI.binding.FldLogsDestPlnt) ? `$filter=Plant eq '${clientAPI.binding.FldLogsDestPlnt}'&$orderby=ShippingPoint` : '$orderby=ShippingPoint';
}
