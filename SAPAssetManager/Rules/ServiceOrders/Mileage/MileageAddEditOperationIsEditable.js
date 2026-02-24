/**
* The Operation Picker should only be editable if there is an Order selected
* @param {IClientAPI} context
*/
import IsOnCreate from '../../Common/IsOnCreate';

export default function MileageAddEditOperationIsEditable(listPickerProxy) {
    const binding = listPickerProxy.getPageProxy().binding || {};
    let orderId, operationNo = '';

    if (IsOnCreate(listPickerProxy)) { //Binding object is WorkOrderHeader
        orderId = binding.OrderId;
        operationNo = binding.OperationNo;
    } else { //Binding object is Confirmation
        orderId = binding.OrderID;
        operationNo = binding.Operation;
    }

    if (orderId && operationNo) {
        return false;
    }

    return orderId ? true : false;
}
