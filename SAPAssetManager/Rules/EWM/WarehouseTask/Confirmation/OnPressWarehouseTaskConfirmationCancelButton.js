import { RemoveSerialNumberMap } from '../SerialNumber/SerialNumberLib';
import { RemoveHandlingUnitStateVariables } from '../../Common/EWMLibrary';
import libCom from '../../../Common/Library/CommonLibrary';
/**
 * switch create/update actions based on WarehouseTask status
 * @param {IClientAPI} context 
 * @returns action
 */
export default function OnPressWarehouseTaskConfirmationCancelButton(context) {
    const unsavedChanges = libCom.unsavedChangesPresent(context);
    if (unsavedChanges) {
        return context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/OnPressWarehouseTaskConfirmationCancelButton.action').then((result) => {
            if (result.data) {
                RemoveSerialNumberMap(context);
                RemoveHandlingUnitStateVariables(context);
            }
        });
    } else {
        RemoveSerialNumberMap(context);
        RemoveHandlingUnitStateVariables(context);
        return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
    }
}
