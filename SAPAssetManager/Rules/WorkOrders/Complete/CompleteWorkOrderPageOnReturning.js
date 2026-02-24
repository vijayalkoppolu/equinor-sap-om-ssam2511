import SmartFormsCompletionLibrary from '../../Forms/SmartFormsCompletionLibrary';
import RedrawCompletePage from './RedrawCompletePage';
import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';
import libCom from '../../Common/Library/CommonLibrary';

export default function CompleteWorkOrderPageOnReturning(context) {
    libCom.setOnChangesetFlag(context, false);
    WorkOrderCompletionLibrary.resetValidationMessages(context);
    SmartFormsCompletionLibrary.updateSmartFormsValidation(context).then(() => {
        return RedrawCompletePage(context);
    });
}
