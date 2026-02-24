import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { GetConfirmedAndTotalQuantity } from '../../Common/EWMLibrary';
import Logger from '../../../Log/Logger';
import { SetSerialNumberMap } from '../SerialNumber/SerialNumberLib';

export const WHO_TASK_CONFIRM = 'WarehouseTaskConfirm';

/**
 * Handle the success for the warehouse task confirmation create action
 * @param {IClientAPI} context 
 * @returns 
 */
export default function OnSuccessWarehouseTaskConfirmationCSCreateUpdate(context) {
    let pageProxy = context.getPageProxy();
    let exceptionHandlingPicker = CommonLibrary.getControlProxy(pageProxy, 'ExceptionPicker');
    let quantityField = CommonLibrary.getControlProxy(pageProxy, 'WhQuantitySimple');
    let warehouseTaskField = CommonLibrary.getControlProxy(pageProxy, 'WhTaskNumSimple');
    let exceptionHandlingPickerValue = exceptionHandlingPicker?.getValue();

    return GetConfirmedAndTotalQuantity(context).then(({ confirmedQuantity, totalQuantity }) => {
        let remainingQuantity = totalQuantity - confirmedQuantity;

        if (exceptionHandlingPicker) {
            const internalProcessCode = exceptionHandlingPickerValue[0]?.BindingObject?.InternalProcessCode;
            const returnValue = exceptionHandlingPickerValue[0]?.ReturnValue || exceptionHandlingPickerValue;

            if (internalProcessCode && ['SPLT', 'SPPB'].includes(internalProcessCode) || returnValue === 'SPLT') {
                if (remainingQuantity > 0) {
                    return context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/CreateSplitConfirmationSuccessMessage.action').then(() => {
                        exceptionHandlingPicker.setValue('');
                        return quantityField.reset().then(() => {
                            return warehouseTaskField.reset().then(() => {
                                return SetSerialNumberMap(context).then(() => {
                                    return Promise.resolve(true);
                                });
                            });
                        });
                    });
                }
            } else {
                return Promise.resolve(true);
            }
        }
        return Promise.resolve(true);
    }).catch((error) => {
        Logger.error('OnSuccessWarehouseTaskConfirmationCSCreateUpdate', error);
        return Promise.reject(error);
    });
}
