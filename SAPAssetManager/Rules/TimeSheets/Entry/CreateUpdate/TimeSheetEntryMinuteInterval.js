import libVal from '../../../Common/Library/ValidationLibrary';
import libCom from '../../../Common/Library/CommonLibrary';
import TimeSheetsIsEnabled from '../../TimeSheetsIsEnabled';
import Logger from '../../../Log/Logger';

export default function getMinuteInterval(context) {

    const validNumbers = [1,5,10,15,30];
    let minutes;

    if (TimeSheetsIsEnabled(context)) {
        minutes = libCom.getAppParam(context, 'TIMESHEET', 'CATSMinutesInterval');
        Logger.info('FCTCLog', 'FCTCLog - TIMESHEET  <getMinuteInterval> CATSMinutesInterval minutes ' + minutes);
         
    } else { //Confirmations enabled
        minutes = libCom.getAppParam(context, 'PMCONFIRMATION', 'LaborTimeMinutesInterval');
        Logger.info('FCTCLog', 'FCTCLog - TIMESHEET  <getMinuteInterval> PMCONFIRMATION minutes ' + minutes);
    }

    minutes = parseInt(Number(minutes));
    Logger.info('FCTCLog', 'FCTCLog - TIMESHEET  <getMinuteInterval>  parseInt returned (backend has valid value) ' + minutes);
 
    if (!libVal.evalIsNumeric(minutes) || (!validNumbers.includes(minutes))) {
        minutes = 15;
        Logger.info('FCTCLog', 'FCTCLog - TIMESHEET  <getMinuteInterval>  minutes is defaulting to 15');
    }
    Logger.info('FCTCLog', 'FCTCLog - TIMESHEET CHECK CAREFULLY. Did backend had valid value?');
    return minutes;
}
