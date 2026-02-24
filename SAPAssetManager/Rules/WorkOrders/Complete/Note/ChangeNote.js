import libCommon from '../../../Common/Library/CommonLibrary';
import { NoteLibrary as NoteLib, TransactionNoteType } from '../../../Notes/NoteLibrary';
import Constants from '../../../Common/Library/ConstantsLibrary';
import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default async function ChangeNote(context) {

    let pageProxy = context.getPageProxy();
    // prepare for note change
    let note = await prepareForNoteUpdate(pageProxy);
    // Fetch the note and process navigation
    return handleNoteNavigation(pageProxy, note);
}
export async function prepareForNoteUpdate(context) {
    libCommon.setStateVariable(context, 'IsOnRejectOperation', false);

    const pageName = libCommon.getPageName(context);
    const workOrderLibrary = WorkOrderCompletionLibrary.getInstance();

    // Determine transaction type
    setTransactionNoteType(context, workOrderLibrary, pageName);

    // Fetch the note
    const note = await handleNoteProcessing(context, workOrderLibrary);

    return note;

}
/**
 * Sets the appropriate Transaction Note Type based on the workflow
 */
function setTransactionNoteType(context, workOrderLibrary, pageName) {
    if (workOrderLibrary.isWOFlow()) {
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrder(pageName));
    } else if (workOrderLibrary.isOperationFlow() || workOrderLibrary.isOperationSplitFlow()) {
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrderOperation(context, pageName));
    } else if (workOrderLibrary.isSubOperationFlow()) {
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrderSubOperation(pageName));
    } else if (workOrderLibrary.isServiceOrderFlow()) {
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.serviceOrder(pageName));
    } else if (workOrderLibrary.isServiceItemFlow()) {
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.serviceItem(pageName));
    }
}

/**
 * Fetches the note and navigates to either Note Update or Note Create
 */
function handleNoteProcessing(context, workOrderLibrary) {
    let odata = workOrderLibrary.getBinding(context);
    let noteEntitySet = libCommon.getStateVariable(context, Constants.transactionNoteTypeStateVariable).component;

    if (workOrderLibrary.isOperationSplitFlow()) {
        odata = odata.MyWorkOrderOperation_Nav;
    }

    return NoteLib.noteDownload(context, `${odata['@odata.id']}/${noteEntitySet}`).then((note) => {
        libCommon.setStateVariable(context, 'SupervisorNote', true);
        context.getPageProxy().setActionBinding(odata);
        return note;
    }).catch(() => {
        return null;
    });
}

function handleNoteNavigation(context, note) {
    if (note?.NewTextString) {
        return navigateToUpdateNote(context, note);
    } else {
        return navigateToCreateNote(context);
    }
}

/**
 * Handles navigation to Note Update action
 */
function navigateToUpdateNote(context, note) {
    libCommon.setStateVariable(context, Constants.noteStateVariable, note);
    return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
}

/**
 * Handles navigation to Note Create action
 */
function navigateToCreateNote(context) {
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    libCommon.setOnChangesetFlag(context, false);
    return context.executeAction('/SAPAssetManager/Actions/Notes/NoteCreateNav.action');
}
