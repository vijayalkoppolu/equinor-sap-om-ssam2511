import CommonLibrary from '../../../Common/Library/CommonLibrary';
import LocalizationLibrary from '../../../Common/Library/LocalizationLibrary';
import Logger from '../../../Log/Logger';

export default async function DecimalPlacesValidationBasedOnUom(context, uom, value, valueControl) { 
    let validationResult = await validateDecimalPlacesBasedOnUom(context, uom, value);

    if (valueControl && !validationResult.isValid) {
        let message;

        if (validationResult.error === 'only_numeric_supported') {
            message = context.localizeText('forms_numeric_integer');
        } else if (validationResult.error === 'max_number_of_decimals_exceeded') {
            message = context.localizeText('max_number_of_decimals', [validationResult.errorValue]);
        }

        CommonLibrary.executeInlineControlError(context, valueControl, message);
    }

    return validationResult.isValid;
}

export async function validateDecimalPlacesBasedOnUom(context, uom, value) {
    if (value && uom) {
        let decimalPlacesSupported = await getDecimalPlacesForUOM(context, uom);
        let decimalSeparator = LocalizationLibrary.getDecimalSeparator(context);
        let numberOfDecimals = value.split(decimalSeparator)[1]?.length || 0;

        if (numberOfDecimals > 0) {
            if (decimalPlacesSupported === 0) {
                return {isValid: false, error: 'only_numeric_supported'};
            } else if (numberOfDecimals > decimalPlacesSupported) {
                return {isValid: false, error: 'max_number_of_decimals_exceeded', errorValue: decimalPlacesSupported};
            }
        }
    }

    return {isValid: true};
}

function getDecimalPlacesForUOM(context, uom) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `UsageUoMs('${uom}')`, [], '$select=DecimalPlaces')
        .then(result => {
            return result.length ? result.getItem(0).DecimalPlaces : 0;
        })
        .catch(error => {
            Logger.error('getDecimalPlacesForUOM', error);
            return 0;
        });
}
