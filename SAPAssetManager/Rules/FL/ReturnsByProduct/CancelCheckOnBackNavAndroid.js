
import libCom from '../../Common/Library/CommonLibrary';
import ResetFlagsAndClosePage from '../../Common/ChangeSet/ResetFlagsAndClosePage';


export default function CancelCheckOnBackNavAndroid(context) {
   
    if (libCom.unsavedChangesPresent(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Page/ConfirmCancelPage.action');
    } else {
        // proceed with cancel without asking
        return ResetFlagsAndClosePage(context);
    }
}
