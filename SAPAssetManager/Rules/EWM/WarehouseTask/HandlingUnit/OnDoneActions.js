import CommonLibrary from '../../../Common/Library/CommonLibrary';
import WarehouseTaskHandlingUnitCreate from './WarehouseTaskHandlingUnitCreate';

/**
 * @param {IClientAPI} context 
 */
export default function OnDoneActions(context) {
    let hasError = false;
    const pageProxy = context.getPageProxy('WarehouseTaskHandlingUnitPage');
    const formCellSection = pageProxy.getControls('FormCellSection0');
    let previousPage;

    const packagingMaterialControl = formCellSection[0]?.getControl('PackagingMaterialPicker');
    const packagingMaterial = packagingMaterialControl?.getValue();
    const handlingUnitControl = formCellSection[0]?.getControl('WhPickHandlingUnitSimple');
    const handlingUnitValue = handlingUnitControl?.getValue();

    if (!packagingMaterial || packagingMaterial.length === 0) {
        CommonLibrary.executeInlineControlError(context, packagingMaterialControl, context.localizeText('field_is_required'));
        hasError = true;
    }

    if (!handlingUnitValue) {
        CommonLibrary.executeInlineControlError(context, handlingUnitControl, context.localizeText('field_is_required'));
        hasError = true;
    }

    // If there are errors, stop the action
    if (hasError) {
        return Promise.reject();
    }

    if (context.binding['@odata.type'] === '#sap_mobile.WarehouseTaskConfirmation') {
        previousPage = context.evaluateTargetPathForAPI('#Page:WarehouseTaskConfirmationLocalEditPage');
    } else {
        previousPage = context.evaluateTargetPathForAPI('#Page:WarehouseTaskConfirmation');
    }
    const confirmationFormCellSection = previousPage.getControls('FormCellContainer');

    // Set handling unit value in HU and confirmation page
    if (handlingUnitValue) {
        CommonLibrary.setStateVariable(context, 'InputtedHandlingUnitValue', handlingUnitValue);
        const pickerControl = confirmationFormCellSection[0]?.getControl('WhDestinationHUPicker');

        // Retrieve existing picker items
        const existingPickerItems = pickerControl.getPickerItems() || [];

        // Add the newly created HU to the picker items
        const newPickerItem = { DisplayValue: handlingUnitValue, ReturnValue: handlingUnitValue };
        const updatedPickerItems = [...existingPickerItems, newPickerItem];

        // Set the updated picker items and value
        pickerControl.setPickerItems(updatedPickerItems);
        pickerControl.setValue([handlingUnitValue]);

        if (context.binding.DestinationHU) {
            context.binding.DestinationHU = handlingUnitValue;
        } else {
            context.binding.DestHU = handlingUnitValue;
        }

    }
    if (packagingMaterial && packagingMaterial.length > 0) {
        const selectedMaterial = packagingMaterial[0];
        CommonLibrary.setStateVariable(context, 'InputtedPackagingMaterialValue', selectedMaterial.ReturnValue);
        CommonLibrary.setStateVariable(context, 'PackagingMaterialCreate', selectedMaterial.BindingObject.PackagingMaterial);
        CommonLibrary.setStateVariable(context, 'PackagingMaterialTypeCreate', selectedMaterial.BindingObject.PackagingMaterialType);
    }

    return WarehouseTaskHandlingUnitCreate(context).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/Common/CloseChildModal.action').then(() => {
            // refresh list picker in Confirmation Page
            previousPage.redraw();
            const formCellSectionHU = previousPage.getControls('FormCellContainer');
            const listPicker = formCellSectionHU[0]?.getControl('WhDestinationHUPicker');
            listPicker.redraw();
            return context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/HandlingUnit/HandlingUnitSuccessMessage.action');
        });
    });
}
