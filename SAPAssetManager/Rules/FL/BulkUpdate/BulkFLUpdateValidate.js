import { GetEDTControls } from './BulkUpdateLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import { ContainerItemStatus } from '../Common/FLLibrary';
export default async function BulkFLUpdateValidate(context) {
    if (!libCom.getStateVariable(context, 'BulkUpdateFinalSave')) {
/* Workaround for the context to refer to the current EDT page instead of the previous page for the
   validation message to be displayed on the current EDT page */
        await libCom.sleep(500);
    }
    const EDTControls = GetEDTControls(context);

    if (ValidationLibrary.evalIsEmpty(EDTControls[0]?.getAllValues()[0]?.Properties)) {   
        return Promise.resolve(true);
    }
    const selectedItemsEDTControls = EDTControls.filter(control => (control));
    if (selectedItemsEDTControls.length === 0) {
        context.executeAction({ 
            'Name': '/SAPAssetManager/Actions/Common/ErrorBannerMessage.action',
            'Properties': {
                'Message': context.localizeText('no_items_selected'),
                'Duration': 7,
                'Animated': true,
                '_Type': 'Action.Type.BannerMessage',
            },
        });
        return Promise.resolve(false);
    }
    let selectedItemsEDTControlsItem;
    if (libCom.getStateVariable(context, 'BulkUpdateFinalSave')) {
        selectedItemsEDTControlsItem = selectedItemsEDTControls;
    } else { 
        selectedItemsEDTControlsItem = EDTControls.filter(control => (control) && control.getAllValues()[0].OdataBinding['@odata.readLink'] === context.binding['@odata.readLink']);
    }
    
    let validationResult = [];
    selectedItemsEDTControlsItem.forEach(async control => {  
        validationResult.push(validateItem(context, control));
    });
    return Promise.all(validationResult).then(results => {
        return results.every(result => result);
    });
}
function validateItem(context, control) {
    const item = control.getAllValues()?.[0];
    let [handlingdecision, storageLocation,otherValidation] = [validateHandlingDecision(context, item.OdataBinding, control.getRowCellByName(0, 'HandlingDecision'), item.Properties.HandlingDecision),
        validateStorageLocation(context, item.OdataBinding, control.getRowCellByName(0, 'StorageLocation'), item.Properties.StorageLocation),
        validateOthers(context, item.OdataBinding, control.getRowCellByName(0, 'ItemSelection'))];
    return Promise.all([handlingdecision, storageLocation,otherValidation]).then(([hdecValid, slocValid, valid]) => {
        let isValid = true;
        isValid &= hdecValid;
        isValid &= slocValid;
        isValid &= valid;
        return isValid ? Promise.resolve(true) : Promise.resolve(false);
    });  
}
function validateStorageLocation(context, binding, control, storageLocation) {
    if (ValidationLibrary.evalIsEmpty(storageLocation)) {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('field_is_required'));
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
}
function validateHandlingDecision(context, binding, control, handlingDecision) {
    if (ValidationLibrary.evalIsEmpty(handlingDecision)) {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('field_is_required'));
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
}
function validateOthers(context, binding, control) {
    if (binding.VoyageUUID && binding.ContainerItemStatus === ContainerItemStatus.Dispatched) { 
        binding.hasErrors = true;
        control?.applyValidation(context.localizeText('edit_not_allowed'));
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
}

