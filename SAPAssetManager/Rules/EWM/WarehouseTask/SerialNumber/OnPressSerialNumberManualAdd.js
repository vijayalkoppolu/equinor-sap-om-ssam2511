import libVal from '../../../Common/Library/ValidationLibrary';
import SerialNumberAdd from './SerialNumberAdd';
import libCom from '../../../Common/Library/CommonLibrary';

export default function OnPressSerialNumberManualAdd(context) {
    const serialNumControl = context.evaluateTargetPath('#Page:-Current/#Control:SerialNum');
    const newSerial = serialNumControl.getValue()?.trim();
    if (!libVal.evalIsEmpty(newSerial)) {
        SerialNumberAdd(context, newSerial);
    } else {
        libCom.executeInlineControlError(context, serialNumControl, context.localizeText('invalid_serial_no'));
    }
}
