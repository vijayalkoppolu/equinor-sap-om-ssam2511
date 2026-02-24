
import libVal from '../../Common/Library/ValidationLibrary';
export default function UOMListPickerQueryOptions(clientAPI) {
    return libVal.evalIsNotEmpty(clientAPI.binding.Product) ? `$filter=MaterialNum eq '${clientAPI.binding.Product}'&$orderby=BaseUOM,UOM` : '$orderby=BaseUOM,UOM';
}
