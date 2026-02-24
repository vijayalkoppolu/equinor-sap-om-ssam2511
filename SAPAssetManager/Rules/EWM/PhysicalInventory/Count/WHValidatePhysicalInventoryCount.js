import libCom from '../../../Common/Library/CommonLibrary';
import libLocal from '../../../Common/Library/LocalizationLibrary';
import libMeasure from '../../../Measurements/MeasuringPointLibrary';
/**
 * This rule validates the quantity entered in the Physical Inventory Count screen.
 */
export default function WHValidatePhysicalInventoryCount(context) {
    let dict = libCom.getControlDictionaryFromPage(context);

    const switches = [
        dict.ZeroCountSwitch,
        dict.HUMissingSwitch,
        dict.EmptyHUSwitch,
        dict.EmptyBinSwitch,
    ];
    const activeSwitch = switches.find(sw => sw.getValue());

    dict.QuantitySimple.clearValidation();

    let validations = [];

    validations.push(validateQuantityGreaterThanZero(context, dict, activeSwitch));
    validations.push(validatePrecisionWithinLimit(context, dict, activeSwitch));
    validations.push(validateSerialNumber(context, context.binding, dict.QuantitySimple));

    return Promise.all(validations).then(results => results.every(i => i));
}

/**
 * Quantity must be > 0 if not zero count
 */
function validateQuantityGreaterThanZero(context, dict, activeSwitch) {
    
    if (!!activeSwitch || libLocal.toNumber(context, dict.QuantitySimple.getValue()) > 0) {
        return Promise.resolve(true);
    }
    let message = context.localizeText('pi_quantity_must_be_greater_than_zero');
    libCom.executeInlineControlError(context, dict.QuantitySimple, message);
    return Promise.reject();
}
/**
 * quantity decimal precision must be within limits
 */
function validatePrecisionWithinLimit(context, dict, activeSwitch) {

    let num = libLocal.toNumber(context, dict.QuantitySimple.getValue());
    let target = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());

    if (activeSwitch) {
        return Promise.resolve(true);
    }

    if (target < 0) {
        target = 0;
    }

    //Did user provide allowed decimal precision for quantity?
    if (Number(libMeasure.evalPrecision(num) > target)) {
        let message;
        if (target > 0) {
            let dynamicParams = [target];
            message = context.localizeText('quantity_decimal_precision_of', dynamicParams);
        } else {
            message = context.localizeText('quantity_integer_without_decimal_precision');
        }
        libCom.executeInlineControlError(context, dict.QuantitySimple, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 *
 * Serial number should match with quantity
 */
export function validateItemSerialNumber(context, binding) {
    const actualNumbers = libCom.getStateVariable(context, 'SerialNumbers')?.actual || (context.binding?.WarehousePhysicalInventoryItemSerial_Nav) || [];
    const serialNumbers = actualNumbers && actualNumbers.filter(item => item.Selected).length;
    if (context.binding.Serialized) {
        if (serialNumbers === Number(binding.Temp_Quantity)) {
            return { valid: true, message: '' };
        }
        return { valid: false, message: context.localizeText('serial_number_count', [serialNumbers, binding.Temp_Quantity]) };
    }
    return { valid: true, message: '' };
}
/**
 * This functions sets inline error message when Serial number does not match with quantity
 */
function validateSerialNumber(context, binding, QuantitySimple) {
    const validationResult = validateItemSerialNumber(context, binding);
    if (validationResult.valid) {
        return Promise.resolve(true);
    }
    libCom.executeInlineControlError(context, QuantitySimple, validationResult.message);
    return Promise.reject();
}

