import libCom from '../../../Common/Library/CommonLibrary';
import { EWM_WT_SERIAL_MAP,RemoveSerialNumberMap  } from '../SerialNumber/SerialNumberLib';
import { RemoveHandlingUnitStateVariables } from '../../Common/EWMLibrary';
import AutoSyncOnSave from '../../../ApplicationEvents/AutoSync/AutoSyncOnSave';
import { WHO_TASK_CONFIRM } from '../HandlingUnit/OnSuccessWarehouseTaskConfirmationCSCreateUpdate';

export default async function ConfirmAll(clientAPI) {
    libCom.removeStateVariable(clientAPI, 'WarehouseConfirmationError');
    const section = clientAPI.getPageProxy().getControl('SectionedTable');
    const selectedItems = section.getSections()[0].getSelectedItems()?.map(item => item.binding) || [];
    if (selectedItems.length === 0) {
        return Promise.resolve(false);
    }

    return ValidateItems(clientAPI, selectedItems).then(async (validationResult) => {
        if (!validationResult.allValid) {
            // Combine nested array failedItems into a single array
            const failedItems = validationResult.failedItems.flat();
            libCom.setStateVariable(clientAPI, 'WHTFailedItems', failedItems);
            section.redraw();
            let actionProperties = {
                'Name': '/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/WarehouseTaskMissingInfo.action',
                'Properties': {
                    'Message': '$(L,missing_information)',
                },
            };
            return clientAPI.executeAction(actionProperties);
        }
  
        const messageText = clientAPI.localizeText('wht_confirm_warning');
        const captionText = clientAPI.localizeText('wht_confirm_title_x',[selectedItems.length]);
        //Prompt user with confirmation warning dialog
        return libCom.showWarningDialog(clientAPI, messageText, captionText).then(async (result) => {
            if (result === true) {
                for (const item of selectedItems) {
                    libCom.setStateVariable(clientAPI, 'WarehouseTask', item);
                    clientAPI.getPageProxy().setActionBinding(clientAPI, item);

                    if (item.SerialNoRequiredLevel) {
                        const serialNumberMap = item.WarehouseTaskSerialNumber_Nav.map(serial => {
                            return {
                                entry: serial,
                                selected: true,
                                downloaded: true,
                                usedInOtherConfirmation: undefined,
                            };
                        });
                        libCom.setStateVariable(clientAPI, EWM_WT_SERIAL_MAP, serialNumberMap);
                    } else {
                        libCom.removeStateVariable(clientAPI, EWM_WT_SERIAL_MAP);
                    }

                  await clientAPI.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/WarehouseTaskConfirmationCSCreate.action')
                    .then(() => {
                        return clientAPI.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/WarehouseTaskStatusUpdate.action');
                    })
                    .then(() => {
                        RemoveSerialNumberMap(clientAPI);
                        RemoveHandlingUnitStateVariables(clientAPI);
                        return clientAPI.executeAction('/SAPAssetManager/Actions/EWM/WarehouseOrders/WarehouseOrderStatusUpdate.action');
                    });
                }

                await AutoSyncOnSave(clientAPI, WHO_TASK_CONFIRM);

                if (!libCom.getStateVariable(clientAPI, 'WarehouseConfirmationError')) {
                    clientAPI.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/ConfirmationSuccess.action');
                    libCom.removeStateVariable(clientAPI, 'WHTFailedItems');
                    const page = libCom.getPageName(clientAPI);
                    libCom.enableToolBar(clientAPI, page, 'ConfirmAll', false);
                }
                libCom.removeStateVariable(clientAPI, 'WarehouseTask');
                const currentFilters = section.filters;
                section.filters = currentFilters;
                return section.redraw();
            }
            return false;
        }).catch(function() {
            return false; //User terminated out of warning dialog
        });

    });
}


export function ValidateItems(context, warehouseTasks) {
    const items = warehouseTasks;
    let validationResult = [];
    items.forEach(async item => {
        validationResult.push(ValidateSingleItem(context, item));
    });
    return Promise.all(validationResult).then(results => {
        const failedItems = results.filter(result => !result.isValid).map(result => result.item);
        const allValid = results.every(result => result.isValid);
        return { allValid, failedItems };
    });
}

function ValidateSingleItem(context, item) {
    let [serialNumbers, destBin] = [ValidateSerialNumbers(context, item), ValidateDestBin(context, item)];
    return Promise.all([serialNumbers, destBin]).then(([serialValid, destBinValid]) => {
        let isValid = true;
        isValid &= serialValid;
        isValid &= destBinValid;
        return { isValid: !!isValid, item };
    });
}

function ValidateSerialNumbers(context, item) {
    if (!item.SerialNoRequiredLevel) {
        return Promise.resolve(true);
    }
    if (item?.WarehouseTaskSerialNumber_Nav?.length !== Number(item.Quantity)) {
        const serialPicker = libCom.getControlProxy(context?.getPageProxy(), 'WhQuantitySimple');
        if (serialPicker) {
            const message = context.localizeText('serial_number_count', [item?.WarehouseTaskSerialNumber_Nav?.length, Number(item.Quantity)]);
            libCom.executeInlineControlError(context, serialPicker, message);
        }
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
}
function ValidateDestBin(context, item) {
    if ((item && !item.DestinationBin)) {
        const destinationBin = libCom.getControlProxy(context?.getPageProxy(), 'DestinationBinPicker');
        if (destinationBin) {
            libCom.executeInlineControlError(context, destinationBin, context.localizeText('field_is_required'));
        }
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
}





