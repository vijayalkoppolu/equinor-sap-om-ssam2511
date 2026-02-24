import { GetEDTControls } from '../../BulkUpdate/BulkUpdateLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import libCom from '../../../Common/Library/CommonLibrary';
import { FLEntityNames } from '../../Common/FLLibrary';
import IsValuationTypeVisible from '../ReservationItems/IsValuationTypeVisible';
export default async function BulkFLWOValidate(context) {
    if (!libCom.getStateVariable(context, 'BulkUpdateFinalSave')) {
        /* Workaround for the context to refer to the current EDT page instead of the previous page for the
           validation message to be displayed on the current EDT page */
        await libCom.sleep(500);
    }
    const EDTControls = GetEDTControls(context);

    if (ValidationLibrary.evalIsEmpty(EDTControls[0]?.getAllValues()[0]?.Properties)) {
        return Promise.resolve(true);
    }
    const selectedItemsEDTControls = EDTControls.filter(control => control.getAllValues()[0].Properties?.ItemSelection);
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
    if (libCom.getStateVariable(context, 'BulkFLUpdateNav')) {
        let quantityOnly = validateQuantity(context, item.OdataBinding, control.getRowCellByName(0, 'Quantity'), item.Properties.Quantity);
        return quantityOnly.then((isValid) => {
            return isValid ? Promise.resolve(true) : Promise.resolve(false);
        });
    } else {
        let [quantity, storageLocation, otherValidation] = [validateQuantity(context, item.OdataBinding, control.getRowCellByName(0, 'Quantity'), item.Properties.Quantity),
        validateStorageLocation(context, item.OdataBinding, control.getRowCellByName(0, 'StorageLocation'), item.Properties.StorageLocation),
        validateOthers(context, item.OdataBinding, control.getRowCellByName(0, 'ItemSelection'))];

        return Promise.all([quantity, storageLocation, otherValidation]).then(([hdecValid, slocValid, otherValid]) => {
            let isValid = true;
            isValid &= hdecValid;
            isValid &= slocValid;
            isValid &= otherValid;
            return isValid ? Promise.resolve(true) : Promise.resolve(false);
        });
    }

}
function validateStorageLocation(context, binding, control, storageLocation) {
    if (ValidationLibrary.evalIsEmpty(storageLocation)) {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('field_is_required'));
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
}
function validateQuantity(context, binding, control, quantity) {
    if (ValidationLibrary.evalIsEmpty(quantity) || Number(quantity) <= 0) {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('field_is_required'));
        return Promise.resolve(false);
    } else if (Number(quantity) !== binding.EntryQty && Number(quantity) > (binding.WithdrawnQty + binding.EntryQty)) {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('fld_return_qty_exceeds'));
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
}
async function validateOthers(context, binding, control) {
    const type = binding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === FLEntityNames.WoProduct) {
        if (binding.IsBatchManaged || binding.IsSerialNumberManaged || binding.ValuationType) {
            binding.hasErrors = true;
            control?.applyValidation(context.localizeText('fld_return_not_allowed'));
            return Promise.resolve(false);
        }
    } else {
        if (binding.IsBatchManaged && ValidationLibrary.evalIsEmpty(binding.Batch)) {
            binding.hasErrors = true;
            control?.applyValidation(context.localizeText('fld_validate_batch_required'));
            return Promise.resolve(false);
        }
        const valuation = await IsValuationTypeVisible(context,binding.Product, binding.Plant);
        if (valuation && ValidationLibrary.evalIsEmpty(binding.ValuationType)) {
            binding.hasErrors = true;
            control?.applyValidation(context.localizeText('fld_valuation_type_required'));
            return Promise.resolve(false);
        }


        if (binding.IsSerialized && ValidationLibrary.evalIsEmpty(binding.SerialNumber)) {
            binding.hasErrors = true;
            control?.applyValidation(context.localizeText('fld_serial_number_required'));
            return Promise.resolve(false);
        }
    }
    return Promise.resolve(true);
}


