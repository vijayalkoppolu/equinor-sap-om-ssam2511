import GetStartDateTime from './GetStartDateTime';
import GetEndDateTime from './GetEndDateTime';
import GetPostingDate from './GetPostingDate';
import GetDuration from './GetDuration';
import ConfirmationDateBounds from '../../ConfirmationDateBounds';
import isValidFinalConfirmation from './IsValidFinalConfirmation';
import Logger from '../../../Log/Logger';
import CommonLibrary from '../../../Common/Library/CommonLibrary';

/**
 *
 * @param {*} context
 */
export default function IsValidConfirmation(context) {


  let binding = context.getBindingObject();

  if (!(binding.OrderID || binding.OrderId)) {
    return false;
  }

  let now = new Date();
  let start = GetStartDateTime(context);
  Logger.info('FCTCLog', 'FCTCLog - TIMESHEET <IsValidConfirmation> StartDate ' + start);

  // If trying to start in the future, not valid
  if (start > now) {
    Logger.info('FCTCLog', 'FCTCLog - TIMESHEET <IsValidConfirmation> Trying to start in the future');
    return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationValidationInvalidStart.action').then(function() {
      return Promise.reject(false);
    });
  }


  let endDateTime = GetEndDateTime(context);
  Logger.info('FCTCLog', 'FCTCLog - TIMESHEET <IsValidConfirmation> EndDateTime ' + endDateTime);
  if (endDateTime > now) {
    Logger.info('FCTCLog', 'FCTCLog - TIMESHEET <IsValidConfirmation> End date in future');
    return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationValidationInvalidEnd.action').then(function() {
      return false;
    });
  }

  const PostingDate = GetPostingDate(context);
  const confirmedDateBounds = ConfirmationDateBounds(PostingDate);
  const lowerBound = confirmedDateBounds[0];
  const upperBound = confirmedDateBounds[1];
  const persNum = CommonLibrary.getPersonnelNumber();
  Logger.info('FCTCLog', 'FCTCLog - TIMESHEET <IsValidConfirmation> Query Confirmation lower bound ' + lowerBound + ' upperBound ' + upperBound + ' PersNum ' + persNum);
  const confirmationsPerConfirmedDateRequest = context.read(
    '/SAPAssetManager/Services/AssetManager.service',
    'Confirmations',
    [],
    `$filter=StartTimeStamp ge datetime'${lowerBound}' and StartTimeStamp le datetime'${upperBound}' and PersonnelNumber eq '${persNum}'`,
  );
  confirmationsPerConfirmedDateRequest.then(results => {
    Logger.info('FCTCLog', 'FCTCLog - TIMESHEET <IsValidConfirmation> Confirmations count: ' + results.length);

    results.forEach((item, index) => {
      Logger.info('FCTCLog', `FCTCLog - TIMESHEET <IsValidConfirmation> Confirmation[${index}] OrderID=${item.OrderID}, Operation=${item.Operation}, Duration=${item.ActualDuration}, Start=${item.StartTimeStamp}, End=${item.EndTimeStamp}`);
    });
  }).catch(err => {
    Logger.error('FCTCLog', 'FCTCLog - TIMESHEET <IsValidConfirmation> Error reading confirmations: ' + err);
  });
  return confirmationsPerConfirmedDateRequest
    .then(observableArray => {
      const totalDurationPerConfirmedDate = observableArray
        .map(item => item.ActualDuration)
        .reduce((acc, item) => {
          return acc + item;
        }, 0);
      Logger.info('FCTCLog', 'FCTCLog - TIMESHEET <IsValidConfirmation> Total time exists in backend: ' + totalDurationPerConfirmedDate);
      const currentDuration = +GetDuration(context);
      if (currentDuration + totalDurationPerConfirmedDate > 1440) {
        Logger.info('FCTCLog', 'FCTCLog - TIMESHEET <IsValidConfirmation> Total time is more than 1440 ');
        return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationValidationInvalidTotalDuration.action').then(function() {
          return false;
        });
      }
      return isValidFinalConfirmation(context);
    })
    .catch(err => {
      Logger.error('FCTCLog', 'FCTCLog - TIMESHEET <IsValidConfirmation> Error reading confirmations: ' + err);
    });
}
