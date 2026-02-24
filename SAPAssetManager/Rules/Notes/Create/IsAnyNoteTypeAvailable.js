import { NoteLibrary } from '../NoteLibrary';
import NoteTypeControlLibrary from './NoteTypeControlLibrary';

export default async function IsAnyNoteTypeAvailable(context) {
    const binding = context.getPageProxy().binding;
    NoteLibrary.didSetNoteTypeTransactionForBindingType(context, binding);

    const service = '/SAPAssetManager/Services/AssetManager.service';
    let noteTypesCount = 0;

    if (binding['@odata.type'] === '#sap_mobile.S4BusinessPartner') {
        noteTypesCount = await context.count(service, 'BPNoteTypes', await NoteTypeControlLibrary.getBPNoteTypeControlQueryOptions(context));
    } else {
        noteTypesCount = await context.count(service, 'ServiceNoteTypes', await NoteTypeControlLibrary.getNoteTypeControlQueryOptions(context, true));
    }

    return noteTypesCount !== 0;
}
