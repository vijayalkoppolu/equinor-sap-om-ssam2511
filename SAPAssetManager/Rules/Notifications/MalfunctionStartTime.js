import libCom from '../Common/Library/CommonLibrary';
import ODataDate from '../Common/Date/ODataDate';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function MalfunctionStartTime(context, toLocal) {
    let breakdown = libCom.getControlProxy(context,'BreakdownStartSwitch').getValue();

    if (breakdown) {
        let odataDate;
        let date = libCom.getControlProxy(context,'MalfunctionStartTimePicker').getValue();
        date.setSeconds(0);

        if (toLocal) { //Validation routines
            odataDate = new ODataDate(date);
            return odataDate.toLocalTimeString();
        }

        if (context.binding?.NotifTimeZone) { //Notification has a time zone, so we need to save in that zone and not use UTC
            odataDate = new OffsetODataDate(context, date, new ODataDate(date).toLocalTimeString(), true);
            return odataDate.toLocalTimeString();
        }

        odataDate = new ODataDate(date); //Saving in UTC
        return odataDate.toDBTimeString(context);
    }
    
    return null;
}
