import { getUpdatedItemsFromEDT } from './BulkEditAllSave';
import { ContainerItemStatus } from '../Common/FLLibrary';
import FLDocumentUpdate from '../Edit/FLDocumentUpdate';
import libCom from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function BulkFLUpdate(context) {
    const items = getUpdatedItemsFromEDT(context);
    const itemsUpdated = items.filter((item) => (item));
    return UpdateFLItemInLoop(context, itemsUpdated);
}
export function UpdateFLItemInLoop(context, items) {
    return items.reduce((prevUpdatePromise, item) => {
        return prevUpdatePromise.then(() => {
            if (libCom.getStateVariable(context, 'Receive')) {
                item.OdataBinding.ActionType = 'RECEIVE';
                item.OdataBinding.ContainerItemStatus =  ContainerItemStatus.Received;  
            }  
            // Values from EDT
            item.OdataBinding.DestStorLocID = item.Properties.StorageLocation;
            //Assign Handling Decision only if it is a number
            const handlingDecision = item.Properties.HandlingDecision;
            item.OdataBinding.HandlingDecision = CheckHandlingDecision(handlingDecision ) ? handlingDecision : item.OdataBinding.HandlingDecision ;
            return FLDocumentUpdate(context, item.OdataBinding);     
        });
    }, Promise.resolve());
}

export function CheckHandlingDecision(handlingDecision) {
    return /^\d+$/.test(handlingDecision);
}
