import libCom from '../Common/Library/CommonLibrary'; 
import ODataLibrary from '../OData/ODataLibrary';
export default function TimeSheetEntryEditNav(context) {
    let binding = context.binding;
    libCom.setOnCreateUpdateFlag(context, 'UPDATE');
    if (ODataLibrary.hasAnyPendingChanges(binding)) {
        return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryEditNav.action');
    } 
}
