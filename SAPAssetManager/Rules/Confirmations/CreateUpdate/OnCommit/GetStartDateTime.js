import libCom from '../../../Common/Library/CommonLibrary';

export function GetStartDate(context) {
    return libCom.getControlProxy(context, 'StartDatePicker')?.getValue() || new Date();
}

export function GetStartTime(context) {
    return libCom.getControlProxy(context, 'StartTimePicker')?.getValue() || new Date();
}

export function MergeDateAndTime(date, time) {
    let start = new Date(time);
    start.setFullYear(date.getFullYear());
    start.setMonth(date.getMonth());
    start.setDate(date.getDate());
    return start;
}

export default function GetStartDateTime(context) {
    let date = GetStartDate(context);
    let time = GetStartTime(context);
    return MergeDateAndTime(date, time);
}
