import ValidationLibrary from '../Common/Library/ValidationLibrary';
import CommonLibrary from '../Common/Library/CommonLibrary';

export default function PushNotificationUserId(context) {
    let userId = context.evaluateTargetPath('#Application/#AppData/UserId');
    if (ValidationLibrary.evalIsEmpty(userId)) {
        return CommonLibrary.getCPMSUserName(context);
    }
    return userId;
}
