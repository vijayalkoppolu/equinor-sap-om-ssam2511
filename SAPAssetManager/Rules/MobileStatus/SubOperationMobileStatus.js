import libMobile from './MobileStatusLibrary';
import libClock from '../ClockInClockOut/ClockInClockOutLibrary';

export default function SubOperationMobileStatus(context) {
    let binding = context.binding;
    let statusText = '';
    if (binding && binding.SubOperationNo && libMobile.isSubOperationStatusChangeable(context)) {
        const mobileStatus = libMobile.getMobileStatus(binding, context);
        statusText = mobileStatus ? context.localizeText(mobileStatus) : statusText;
        if (libClock.isBusinessObjectClockedIn(context)) {
            statusText += ' - ' + context.localizeText('clocked_in');
        }
    } 
    return statusText;
}
