import GetStartDateTime from './GetStartDateTime';
import libCom from '../../../Common/Library/CommonLibrary';

// Function to calculate the end date based on start date and duration
export function CalculateEndDateTime(startDate, duration) {
    let endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + duration);
    endDate.setSeconds(0);
    return endDate;
}

// Main function to get end date time using the context
export default function GetEndDateTime(context) {
    let startDate = GetStartDateTime(context);
    let duration = libCom.getControlProxy(context, 'DurationPkr')?.getValue() || 0;
    
    // Use the CalculateEndDateTime function to get the end date
    return CalculateEndDateTime(startDate, duration);
}
