import CommonLibrary from '../../../Common/Library/CommonLibrary';

/**
 * replace 0 with empty space
 * @param {IClientAPI} context 
 */
export default function QuantityOnChange(context) {
    if (context._control.getEditable()) {
        CommonLibrary.clearValidationOnInput(context);
        if (Number(context._control.getValue()) === 0) {
            context._control.setValue('');
        }
    }
}
