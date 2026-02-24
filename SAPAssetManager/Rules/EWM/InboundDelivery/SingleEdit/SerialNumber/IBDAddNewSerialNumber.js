import { AddNewItemSerial, GetIBDSerialNumbers, UpdateIBDControls } from './IBDSerialNumberLib';

export default function IBDAddNewSerialNumber(context) {
    const map = GetIBDSerialNumbers(context);
    const serialField = context.evaluateTargetPath('#Page:-Current/#Control:SerialNum');
    const manualAdd = context.evaluateTargetPath('#Page:-Current/#Control:SerialButton');
    const newValue = serialField.getValue()?.trim();

    const existingSerialNumber = map.find(c => c.entry.SerialNumber === newValue);
    if (existingSerialNumber) {
        existingSerialNumber.selected = true;
    } else {
        AddNewItemSerial(context, map, newValue);
    }
    serialField?.setValue('');
    manualAdd?.setEnabled(false);
    UpdateIBDControls(context, map);
}

