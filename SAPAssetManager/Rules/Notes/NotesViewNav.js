import { NoteLibrary as NoteLib} from './NoteLibrary';
import libCom from '../Common/Library/CommonLibrary';
import libTelemetry from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function NotesViewNav(clientAPI) {
    // Set the transaction type before navigating to the Note View page
    let page = libCom.getPageName(clientAPI);
    if (page === 'WCMNotesListPage') {
        page = libCom.getPageName(clientAPI.evaluateTargetPathForAPI('#Page:-Previous'));
    }
    
    if (NoteLib.didSetNoteTypeTransactionFlagForPage(clientAPI, page)) {
        return libTelemetry.executeActionWithLogPageEvent(clientAPI,
            '/SAPAssetManager/Actions/Notes/NoteViewNav.action',
            clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/Notes.global').getValue(),
            libTelemetry.PAGE_TYPE_DETAIL);
    }
    return null;
}
