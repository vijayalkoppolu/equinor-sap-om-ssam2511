/**
* Describe this function...
* @param {IClientAPI} context
*/
import CommonLibrary from '../Common/Library/CommonLibrary';
export default function MyNotificationFilterQuery(context) {
    const userId = CommonLibrary.getUserGuid(context);        
    return `${getReportedByFilterQuery(context)} or (NotifMobileStatus_Nav/CreateUserGUID eq '${userId}' and NotifMobileStatus_Nav/MobileStatus ne 'RECEIVED')`;
}

export function getReportedByFilterQuery(context) {
    const userName = CommonLibrary.getSapUserName(context);
    return `ReportedBy eq '${userName}'`;
}
