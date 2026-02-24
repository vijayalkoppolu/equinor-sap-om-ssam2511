/**
* This is the action called when the user taps on the details button in the Bulk Edit page for FL.
* @param {IClientAPI} clientAPI
*/
import { getUpdatedItemsFromEDT } from './BulkFLSave';
import libCom from '../../../Common/Library/CommonLibrary';
import { UpdateFLItemInLoop } from './BulkFLUpdate';
import BulkFLReadyToPackValidate from './BulkFLReadyToPackValidate';
export default function EditFLItemNav(context) {
    const clientAPI = context._control.getTable().context.clientAPI;
    let items = getUpdatedItemsFromEDT(clientAPI);
    items = items.filter(item => item);
    libCom.setStateVariable(context, 'BulkFLUpdateNav', true);
    return BulkFLReadyToPackValidate(context).then((validationResult) => {
        if (!validationResult) {
            return undefined;
        }
    return UpdateFLItemInLoop(clientAPI.getPageProxy(), items).then(async () => {
        context.binding.FldLogsVoyageDestStage = context._control.getTable().getAllValues()[0].Properties.ReceivingPoint;
        context.binding.FldLogsShptLocationId = context._control.getTable().getAllValues()[0].Properties.LocationId;
        clientAPI.getPageProxy().setActionBinding(context.binding);
        return clientAPI.getPageProxy().executeAction('/SAPAssetManager/Actions/FL/ReadyToPack/FLReadyToPackEditNav.action');
    });
});
}


