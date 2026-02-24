import { RemoveSerialNumberMap } from '../SerialNumber/SerialNumberLib';

/**
 * Remove locally created WarehouseTaskConfirmation and navigate back to the previous page
 * @param {IClientAPI} context 
 * @returns 
 */
export default function OnPressWarehouseTaskConfirmationDiscardButton(context) {
    let action = Promise.resolve();
    const actionName = '/SAPAssetManager/Actions/DiscardWarningMessage.action';
    return context.executeAction(actionName).then(successResult => {
        if (successResult.data) {
            action = '/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/OnPressWarehouseTaskConfirmationDiscardButton.action';
        }

        return context.executeAction(action).then(() => {
            return context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseOrders/WarehouseOrderStatusUpdate.action').then(() => { 
                RemoveSerialNumberMap(context);
            });
        });
    });
}
