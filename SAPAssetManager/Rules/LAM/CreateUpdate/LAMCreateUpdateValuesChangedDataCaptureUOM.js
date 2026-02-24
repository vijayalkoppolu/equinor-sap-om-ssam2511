import CommonLibrary from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import StartValidation from './ValidationRules/StartValidation';
import EndValidation from './ValidationRules/EndValidation';
import LengthValidation from './ValidationRules/LengthValidation';


/** @param {IFormCellProxy} controlProxy */
export default function LAMCreateUpdateValuesChangedDataCaptureUOM(controlProxy) {
    const section = CommonLibrary.GetParentSection(controlProxy);
    const [[start, startVal], [end, endVal], [length, lengthVal], [uom, uomVal], [startMarker, startMarkerVal], [endMarker, endMarkerVal]] = ['StartPoint', 'EndPoint', 'Length', 'UOMLstPkr', 'StartMarkerLstPkr', 'EndMarkerLstPkr']
        .map(n => section.getControl(n))
        .map(c => [c, CommonLibrary.getControlValue(c)]);

    const uomMarkerVal = CommonLibrary.getControlValue(section.getControl('MarkerUOMLstPkr'));

    StartValidation(controlProxy, start, startVal, uomVal);
    EndValidation(controlProxy, end, endVal, uomVal);

    StartValidation(controlProxy, startMarker, startMarkerVal, uomMarkerVal);
    EndValidation(controlProxy, endMarker, endMarkerVal, uomMarkerVal);

    LengthValidation(controlProxy, length, lengthVal);
    CheckListPickerValue(controlProxy, uom, uomVal);
}

function CheckListPickerValue(context, control, value) {
    if (libVal.evalIsEmpty(CommonLibrary.getListPickerValue(value))) {
        let message = context.localizeText('field_is_required');
        CommonLibrary.executeInlineControlError(context, control, message);
    }
}
