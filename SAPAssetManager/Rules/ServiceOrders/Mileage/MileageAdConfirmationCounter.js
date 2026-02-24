import GenerateLocalID from '../../Common/GenerateLocalID';
import MileageAddEditOperationNo from './MileageAddEditOperationNo';
import MileageAddEditOrderId from './MileageAddEditOrderId';


export default async function MileageAdConfirmationCounter(pageProxy) {
    let orderId = MileageAddEditOrderId(pageProxy);
    let operationNo = MileageAddEditOperationNo(pageProxy);

    if (orderId && operationNo) {
        let queryOptions = `$filter=OrderID eq '${orderId}' and Operation eq '${operationNo}'`;
        let counter = await GenerateLocalID(pageProxy, 'Confirmations', 'ConfirmationCounter', '00000000', queryOptions, '', 'ConfirmationCounter');
        
        pageProxy.getClientData().ConfirmationCounterTemp = counter; //Save to be used on note create
        return counter;
    } else {
        return '';
    }
}
