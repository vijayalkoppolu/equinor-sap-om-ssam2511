import { ProductReturnStatus } from '../Common/FLLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function ProductDetailDescription(clientAPI) {

    const statusAtRemote = ProductReturnStatus.AtRemote;

    if (clientAPI.binding.FldLogsReturnStatus === statusAtRemote) {
        return clientAPI.binding.PurchaseOrderItem === '0' || libVal.evalIsEmpty(clientAPI.binding.PurchaseOrderItem) ? '' : clientAPI.binding.PurchaseOrderItem;
    } else {
        return clientAPI.binding.OutboundDelivery;
    }
}
