
import libVal from '../../Common/Library/ValidationLibrary';
export default function FormatOrderCategory(clientAPI) {
    return clientAPI.binding.OrderCategory === '0' || libVal.evalIsEmpty(clientAPI.binding.OrderCategory) ? '-' : clientAPI.binding.OrderCategory;
}

