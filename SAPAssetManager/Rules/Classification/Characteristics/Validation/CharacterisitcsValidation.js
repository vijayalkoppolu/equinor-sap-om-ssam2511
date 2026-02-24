import libCommon from '../../../Common/Library/CommonLibrary';
import validateControl from './CharacteristicsValidationControl';

/**
 * Get the "CharValFrom" and "CharValTo" control from the page and apply
 * validation rules on them.
 * @param {ClientAPI} context
 * @returns {boolean} returns false if there are validation errors.
 */
export default function CharacterisitcsValidation(context) {
    let controlNameFrom = libCommon.getStateVariable(context,'VisibleControlFrom');
    let controlFrom = libCommon.getControlProxy(context, controlNameFrom);

    if (controlFrom) {
        return validateControl(context, controlFrom);
    }

    return true;
}
