import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import MobileStatusCompleted from '../../MobileStatus/MobileStatusCompleted';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import TimeSheetCreateIsEnabled from '../../TimeSheets/TimeSheetCreateIsEnabled';
import ConfirmationCreateIsEnabled from '../../Confirmations/CreateUpdate/ConfirmationCreateIsEnabled';

export default function ObjectCardTimeVisible(context) {
    let completedStatus = MobileStatusCompleted(context);
    let mobileStatus = libMobile.getMobileStatus(context.binding, context);
    let checkMobileStatus = (mobileStatus !== completedStatus);
    

    return checkMobileStatus && ((TimeSheetCreateIsEnabled(context) || ConfirmationCreateIsEnabled(context)) && !IsSubOperationLevelAssigmentType(context));
}
