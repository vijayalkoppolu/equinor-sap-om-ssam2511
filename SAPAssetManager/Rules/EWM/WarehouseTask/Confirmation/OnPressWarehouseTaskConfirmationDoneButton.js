import { GetSelectedCount, GetSerialNumberMap } from '../SerialNumber/SerialNumberLib';
import { RemoveHandlingUnitStateVariables, GetConfirmedAndTotalQuantity, isTaskWithSerialNumbers } from '../../Common/EWMLibrary';
import OnSuccessWarehouseTaskConfirmationCSCreateUpdate from '../HandlingUnit/OnSuccessWarehouseTaskConfirmationCSCreateUpdate';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';
import { RemoveSerialNumberMap } from '../SerialNumber/SerialNumberLib';
import { WHO_TASK_CONFIRM } from '../HandlingUnit/OnSuccessWarehouseTaskConfirmationCSCreateUpdate';
import ExecuteActionWithAutoSync from '../../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

/**
 * @param {IClientAPI} context 
 * @returns action
 */
export default function OnPressWarehouseTaskConfirmationDoneButton(context, binding = context.binding) {
    CommonLibrary.setStateVariable(context, 'WarehouseTaskValue', binding.WarehouseTask);
    const quantityFieldControl = CommonLibrary.getControlProxy(context?.getPageProxy(), 'WhQuantitySimple');
    const exceptionHandlingPicker = CommonLibrary.getControlProxy(context?.getPageProxy(), 'ExceptionPicker');
    const exceptionHandlingPickerValue = exceptionHandlingPicker?.getValue();
    const internalProcessCode = exceptionHandlingPickerValue[0]?.BindingObject?.InternalProcessCode;

    if (internalProcessCode && ['DIFF'].includes(internalProcessCode)) {
        CommonLibrary.setStateVariable(context, 'ExceptionDiffCase', true);
    }

    return QuantityFieldValidations(context).then(isValid => {
        if (!isValid) {
            CommonLibrary.executeInlineControlError(context, quantityFieldControl, context.localizeText('accept_all_error'));
            return Promise.reject();
        }
        CommonLibrary.setStateVariable(context, 'WarehouseNoForTaskConfirmation', binding.WarehouseNo);
        CommonLibrary.setStateVariable(context, 'WarehouseOrderForTaskConfirmation', binding.WarehouseOrder);

        const action = binding['@odata.readLink'].includes('WarehouseTaskConfirmations')
            ? '/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/WarehouseTaskConfirmationCSUpdate.action'
            : '/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/WarehouseTaskConfirmationCSCreate.action';

        return runAction(context, action).then(() => {
            return context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/WarehouseTaskStatusUpdate.action')
                .then(() => {
                    RemoveHandlingUnitStateVariables(context);
                    return context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseOrders/WarehouseOrderStatusUpdate.action').then(() => {
                            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action', WHO_TASK_CONFIRM).then(() => {
                                return RemoveSerialNumberMap(context);
                });
                    });
                });
        }).catch((error) => {
            Logger.error('OnPressWarehouseTaskConfirmationDoneButton error', error);
            return Promise.reject(error);
        });
    });
}

/**
 * Execute the CS update/create action and handle the result
 * @param {IClientAPI} context 
 * @param {String} action 
 * @returns result  or false
 */
async function runAction(context, action, binding = context.binding) {
    await context.executeAction(action);
    if (!binding['@odata.readLink'].includes('WarehouseTaskConfirmations')) {
        return OnSuccessWarehouseTaskConfirmationCSCreateUpdate(context).then((result) => {
            Logger.debug('*** runAction OnSuccessWarehouseTaskConfirmationCSCreateUpdate completed ', result);
            return Promise.resolve(result);
        });
    }
    return Promise.resolve(false);
}

/**
 * Validate the quantity field
 * @param {IClientAPI} context 
 * @returns 
 */
export function QuantityFieldValidations(context, binding = context.binding) {
    const enteredQuantity = parseFloat(context.evaluateTargetPath('#Control:WhQuantitySimple/#Value'));
    if (isTaskWithSerialNumbers(context) && GetSelectedCount(GetSerialNumberMap(context)) !== enteredQuantity) {
        return Promise.resolve(false);
    }

    const isUpdateScenario = binding['@odata.readLink'].includes('WarehouseTaskConfirmations');

    if (isUpdateScenario) {
        if (enteredQuantity === parseFloat(binding.ActualQuantity)) {
            return Promise.resolve(true);
        }
    }

    return GetConfirmedAndTotalQuantity(context).then(({ confirmedQuantity, totalQuantity }) => {
        const remainingQuantity = totalQuantity - confirmedQuantity;
        if (isUpdateScenario) {
            const actualQuantity = parseFloat(binding.ActualQuantity);
            return enteredQuantity <= (remainingQuantity + actualQuantity);
        }
        return enteredQuantity <= remainingQuantity;

    }).catch(error => {
        Logger.error('Error in QuantityFieldValidations:', error);
        return false;
    });
}
