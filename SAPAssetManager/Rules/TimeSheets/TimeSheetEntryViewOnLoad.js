import ODataLibrary from '../OData/ODataLibrary';
export default function TimeSheetEntryEditNav(context) {
    let binding = context.binding;
    if (!ODataLibrary.hasAnyPendingChanges(binding)) {
        context.setActionBarItemVisible(0, false);
    } 
}
