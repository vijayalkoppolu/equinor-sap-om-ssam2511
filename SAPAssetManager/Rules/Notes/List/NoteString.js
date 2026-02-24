import { NoteLibrary } from '../NoteLibrary';

export default function NoteString(context) {
    let note = NoteLibrary.getNoteText(context, context.binding);
    /// If multipiple notes find the new line character and display the first note otherwise display the whole note
    let firstNote = (note.indexOf('\n') === -1) || (note.indexOf('\n') === 0) ? note : note.substring(0, note.indexOf('\n'));
    return firstNote;
}
