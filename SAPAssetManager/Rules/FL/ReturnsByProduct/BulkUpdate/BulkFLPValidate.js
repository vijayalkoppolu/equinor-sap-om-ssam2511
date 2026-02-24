import { GetEDTControls } from '../../BulkUpdate/BulkUpdateLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import libCom from '../../../Common/Library/CommonLibrary';

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

    if (libCom.getStateVariable(context, 'IsInitiateReturn')) {
        if (!libCom.getStateVariable(context, 'BulkFLUpdateNav')) {
            let [quantity, recommAction, uom,destStore, prdType] = [validateQuantity(context, item.OdataBinding, control.getRowCellByName(0, 'Quantity'), item.Properties.EntryQty),
            validateLstPkrs(context, item.OdataBinding, control.getRowCellByName(0, 'RecommActionLstPkr'), item.Properties.FldLogsRecommendedAction),
            validateLstPkrs(context, item.OdataBinding, control.getRowCellByName(0, 'ReturnableQuantityUOMLstPkr'), item.Properties.RetblQtyOrderUnit),
            IsDestStoreValid(context, item.OdataBinding, control.getRowCellByName(0, 'Quantity'), item.OdataBinding.SupplyingStorageLocation),
            IsProdTypeValid(context, item.OdataBinding, control.getRowCellByName(0, 'ItemSelection'))];

            return Promise.all([quantity, recommAction, uom, destStore, prdType]).then(([hdecValid, recommActionValid, uomValid, prdTypeValid, destStoreValid]) => {
                let isValid = true;
                isValid &= hdecValid;
                isValid &= recommActionValid;
                isValid &= uomValid;
                isValid &= destStoreValid;
                isValid &= prdTypeValid;
                return isValid ? Promise.resolve(true) : Promise.resolve(false);
            });
        } else {
            let [quantity, recommAction, uom, prdType] = [validateQuantity(context, item.OdataBinding, control.getRowCellByName(0, 'Quantity'), item.Properties.EntryQty),
            validateLstPkrs(context, item.OdataBinding, control.getRowCellByName(0, 'RecommActionLstPkr'), item.Properties.FldLogsRecommendedAction),
            validateLstPkrs(context, item.OdataBinding, control.getRowCellByName(0, 'ReturnableQuantityUOMLstPkr'), item.Properties.RetblQtyOrderUnit),
            IsProdTypeValid(context, item.OdataBinding, control.getRowCellByName(0, 'ItemSelection'))];

            return Promise.all([quantity, recommAction, uom, prdType]).then(([hdecValid, recommActionValid, uomValid, prdTypeValid]) => {
                let isValid = true;
                isValid &= hdecValid;
                isValid &= recommActionValid;
                isValid &= uomValid;
                isValid &= prdTypeValid;
                return isValid ? Promise.resolve(true) : Promise.resolve(false);
            });
        }
    } else {
        if (!libCom.getStateVariable(context, 'BulkFLUpdateNav')) {
            let [quantity, recvgPoint, destStore,recommActionValid] = [validateLoadQuantity(context, item.OdataBinding, control.getRowCellByName(0, 'LoadingQuantity'), item.Properties.LoadingQtyInOrderUnit),
            validateLstPkrs(context, item.OdataBinding, control.getRowCellByName(0, 'ReceivingPointListPkr'), item.Properties.FldLogsVoyageDestStage),
            IsDestStoreValid(context, item.OdataBinding, control.getRowCellByName(0, 'LoadingQuantity'), item.OdataBinding.SupplyingStorageLocation),
            IsRecommActionValid(context, item.OdataBinding, control.getRowCellByName(0, 'LoadingQuantity'), item.OdataBinding.FldLogsRecommendedAction)];

            return Promise.all([quantity, recvgPoint, destStore, recommActionValid]).then(([hdecValid, recvgPointValid, destStoreValid, actionValid]) => {
                let isValid = true;
                isValid &= hdecValid;
                isValid &= recvgPointValid;
                isValid &= destStoreValid;
                isValid &= actionValid;
                return isValid ? Promise.resolve(true) : Promise.resolve(false);
            });
        } else {
            let [quantity, recvgPoint] = [validateLoadQuantity(context, item.OdataBinding, control.getRowCellByName(0, 'LoadingQuantity'), item.Properties.LoadingQtyInOrderUnit),
            validateLstPkrs(context, item.OdataBinding, control.getRowCellByName(0, 'ReceivingPointListPkr'), item.Properties.FldLogsVoyageDestStage)];

            return Promise.all([quantity, recvgPoint]).then(([hdecValid, recvgPointValid]) => {
                let isValid = true;
                isValid &= hdecValid;
                isValid &= recvgPointValid;
                return isValid ? Promise.resolve(true) : Promise.resolve(false);
            });
        }
    }

}

/**
 * Validates that the destination storage location is not empty.
 * @param {object} context - The execution context.
 * @param {object} binding - The data binding object for the row.
 * @param {object} control - The control for applying validation feedback.
 * @param {string} destStore - The destination storage location value to validate.
 * @returns {Promise<boolean>} - Resolves with true if valid, otherwise false.
 */
function IsDestStoreValid(context, binding, control, destStore) {
    if (ValidationLibrary.evalIsEmpty(destStore)) {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('fld_dest_store_required'));
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
}

/**
 * Validates that the recommended action is not empty.
 * @param {object} context - The execution context.
 * @param {object} binding - The data binding object for the row.
 * @param {object} control - The control for applying validation feedback.
 * @param {string} action - The recommended action to validate.
 * @returns {Promise<boolean>} - Resolves with true if valid, otherwise false.
 */
function IsRecommActionValid(context, binding, control, action) {
    if (ValidationLibrary.evalIsEmpty(action)) {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('field_is_required'));
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
}
function validateLstPkrs(context, binding, control, LstPkr) {
    if (ValidationLibrary.evalIsEmpty(LstPkr)) {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('field_is_required'));
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
}
function validateQuantity(context, binding, control, quantity) {
    let returnableQty = Number(binding.RetblQtyInBaseUnit);
    if (ValidationLibrary.evalIsEmpty(quantity) || Number(quantity) <= 0) {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('field_is_required'));
        return Promise.resolve(false);
    } else if (returnableQty <= 0 || Number(quantity) > returnableQty) {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('fld_validate_no_qty'));
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
}

function validateLoadQuantity(context, binding, control, quantity) {
    let returnableQty = Number(binding.RetblQtyInBaseUnit);
    if (ValidationLibrary.evalIsEmpty(quantity) || Number(quantity) <= 0) {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('field_is_required'));
        return Promise.resolve(false);
    } else if (Number(quantity) !== returnableQty) {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('fld_validate_pick_qty'));
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
}

function IsProdTypeValid(context, binding, control) {
    let isNonStdProduct = binding?.IsSerialized === 'X' || binding?.IsInternalBatchManaged === 'X' || binding?.ValuationType === 'X';
    if (isNonStdProduct) {
        binding.hasErrors = true;
        control.applyValidation(context.localizeText('fld_prd_type_non_std_invalid'));
        return Promise.resolve(false);
    } else return Promise.resolve(true);
    
   
}



