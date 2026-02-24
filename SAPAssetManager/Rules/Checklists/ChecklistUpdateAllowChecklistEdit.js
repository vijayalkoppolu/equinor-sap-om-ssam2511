import libCom from '../Common/Library/CommonLibrary';
import ODataLibrary from '../OData/ODataLibrary';
export default function checklistUpdateAllowChecklistEdit(context) {

    if (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.CL.Edit') === 'Y' || ODataLibrary.hasAnyPendingChanges(context.binding)) {
        //Make the checklist edit screen read-only for viewing purposes if the chosen checklist has already been completed in the backend
        return libCom.getStateVariable(context, 'AllowChecklistEdit');
    } else {
        return false;
    }

}
