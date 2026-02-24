
import libCom from '../../Common/Library/CommonLibrary';
import StartValidation from './ValidationRules/StartValidation';
import EndValidation from './ValidationRules/EndValidation';
import LengthValidation from './ValidationRules/LengthValidation';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import LAMUpdateDistanceValues from './LAMUpdateDistanceValues';

export default function LAMCreateUpdateValuesChanged(context) {
    ResetValidationOnInput(context);
    let pageProxy = context.getPageProxy(context);
    let controls = libCom.getControlDictionaryFromPage(pageProxy);
    let start = libCom.getFieldValue(pageProxy, 'StartPoint');
    let end = libCom.getFieldValue(pageProxy, 'EndPoint');
    let length_field = libCom.getFieldValue(pageProxy, 'Length');

    let startMarkerValue = libCom.getListPickerValue(libCom.getFieldValue(pageProxy, 'StartMarkerLstPkr', '', null, true));
    let endMarkerValue = libCom.getListPickerValue(libCom.getFieldValue(pageProxy, 'EndMarkerLstPkr', '', null, true));

    LAMUpdateDistanceValues(context);
    StartValidation(context, controls.StartPoint, start, startMarkerValue);
    EndValidation(context, controls.EndPoint, end, startMarkerValue);
    LengthValidation(context, controls.Length, length_field);
    StartValidation(context, controls.StartPoint, start, endMarkerValue);
    EndValidation(context, controls.EndPoint, end, endMarkerValue);

}
