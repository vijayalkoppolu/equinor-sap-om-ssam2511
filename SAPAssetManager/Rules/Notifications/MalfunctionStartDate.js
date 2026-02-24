import libCom from '../Common/Library/CommonLibrary';
import ODataDate from '../Common/Date/ODataDate';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function MalfunctionStartDate(context, toLocal) {
    let breakdown = libCom.getControlProxy(context,'BreakdownStartSwitch').getValue();

    if (breakdown) {
        let odataDate;
        let startDate = libCom.getControlProxy(context, 'MalfunctionStartDatePicker').getValue();
        let startTime = libCom.getControlProxy(context,'MalfunctionStartTimePicker').getValue();

        startTime.setFullYear(startDate.getFullYear());
        startTime.setMonth(startDate.getMonth());
        startTime.setDate(startDate.getDate());
        let date = new Date(startTime);

        if (toLocal) { //Validation routines
            odataDate = new ODataDate(date);
            return odataDate.toLocalDateString();
        }
        if (context.binding?.NotifTimeZone) { //Notification has a time zone, so we need to save in that zone and not use UTC
            odataDate = new OffsetODataDate(context, date, new ODataDate(date).toLocalTimeString(), true);
            return odataDate.toLocalDateString();
        }
        odataDate = new ODataDate(date); //Saving in UTC
        return odataDate.toDBDateString(context);
    }
    
    return null;
}
