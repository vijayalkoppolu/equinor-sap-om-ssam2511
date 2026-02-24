import libCom from '../../Common/Library/CommonLibrary';
import BulkUpdateClosePage from '../BulkUpdate/BulkUpdateClosePage';
export default function FLUpdateCancel(context) {
    const unsavedChanges = libCom.unsavedChangesPresent(context);
    if (unsavedChanges) {
        return context.executeAction({
            Name: '/SAPAssetManager/Actions/Page/ConfirmCancelPage.action',
            Properties: {
                OnOK : '/SAPAssetManager/Rules/FL/BulkUpdate/BulkUpdateClosePage.js',
            },
        });
    } else {
      return BulkUpdateClosePage(context);
    }
}

