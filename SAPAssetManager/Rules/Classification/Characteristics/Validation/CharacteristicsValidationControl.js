import fieldIsRequired from './CharacteristicsFieldIsRequired';
import maxLength from './CharacteristicsMaximumLength';
import negative from './CharacteristicsNegative';
import valueFromControl from '../CharacteristicValueFromControl';
import numberOfDecimals from './CharacteristicsValidateDecimal';
import numberOfChar from './CharacteristicsNumberOfChar';
import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function CharacteristicsValidationControl(context, control) {
    let value = valueFromControl(context, control);
    let dataType = context.binding.Characteristic.DataType;
    if (dataType === 'NUM' || dataType === 'CURR') {
        if (value.includes(',') && !value.includes('.')) {
            value = value.replace(',', '.');
        }
    }

    let isListPicker = CommonLibrary.getStateVariable(context,'ListPicker');
    let isMultiListPicker = CommonLibrary.getStateVariable(context,'MultiListPicker');
    if (isListPicker || isMultiListPicker) {
        if (control.getValue().length === 0) {
            let message = context.localizeText('field_is_required');
            return CommonLibrary.executeInlineControlError(context, control, message);
        } else {
            return true;
        }
    }

    return fieldIsRequired(context, value, control) && maxLength(context,value,control) && negative(context, value, control) && numberOfDecimals(context, value, control) && numberOfChar(context, value, control);   
}
