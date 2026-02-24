import NotesListLibrary from './NotesListLibrary';

export default async function NoteType(context) {
    const hasItemProperty = (context.binding.ItemNo && context.binding.ItemNo !== '000000') || (context.binding.RefItemID && context.binding.RefItemID !== '000000');
    const textObjectType = hasItemProperty ? 'CRM_ORDERI' : 'CRM_ORDERH';
    const noteType = await NotesListLibrary.fetchNoteType(context, context.binding.TextID, textObjectType);
    return noteType?.Description || '';
}
