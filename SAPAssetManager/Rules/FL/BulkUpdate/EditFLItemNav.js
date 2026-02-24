/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import { getUpdatedItemsFromEDT } from './BulkEditAllSave';
import libCom from '../../Common/Library/CommonLibrary';
import { UpdateFLItemInLoop, CheckHandlingDecision } from './BulkFLUpdate';
export default function EditFLItemNav(context) {
    const clientAPI = context._control.getTable().context.clientAPI;
    let items = getUpdatedItemsFromEDT(clientAPI);
    items = items.filter(item => item);
    libCom.setStateVariable(context, 'BulkFLUpdate', true);
    return UpdateFLItemInLoop(clientAPI.getPageProxy(), items).then(async () => {
        const handlingDecision = context._control.getTable().getAllValues()[0].Properties.HandlingDecision;
        //Assign Handling Decision only if it is a number
        context.binding.HandlingDecision = CheckHandlingDecision(handlingDecision) ? handlingDecision : context.binding.HandlingDecision;

        context.binding.DestStorLocID = context._control.getTable().getAllValues()[0].Properties.StorageLocation;
        clientAPI.getPageProxy().setActionBinding(context.binding);
        return clientAPI.getPageProxy().executeAction('/SAPAssetManager/Actions/FL/Edit/EditFLDocumentPageNav.action');
    });
}


