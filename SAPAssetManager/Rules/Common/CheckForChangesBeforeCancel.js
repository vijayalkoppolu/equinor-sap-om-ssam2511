import ApplicationSettings from './Library/ApplicationSettings';
import libCom from './Library/CommonLibrary';
import ResetFlagsAndClosePage from './ChangeSet/ResetFlagsAndClosePage';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function CheckForChangesBeforeCancel(context) {
    libCom.clearFromClientData(context, 'BOMPartAdd', false);
    libCom.getStateVariable(context, 'LAMDefaultRow');
    ApplicationSettings.remove(context,'Geometry');
    if (libCom.unsavedChangesPresent(context) && !libCom.isDefined(libCom.getStateVariable(context, 'LAMDefaultRow'))) {
        return context.executeAction('/SAPAssetManager/Actions/Page/ConfirmCancelPage.action');
    } else {
        // proceed with cancel without asking
        return ResetFlagsAndClosePage(context);
    }
}
