
import libVal from '../../Common/Library/ValidationLibrary';
export default function FormatPurchaseOrderItem(clientAPI) {
    return clientAPI.binding.PurchaseOrderItem === '0' || libVal.evalIsEmpty(clientAPI.binding.PurchaseOrderItem) ? '-' : clientAPI.binding.PurchaseOrderItem;
}
