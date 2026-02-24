import IsEditS4RelatedObjectEnabled from '../../ServiceOrders/IsEditS4RelatedObjectEnabled';
import NotesListLibrary from './NotesListLibrary';

export default function NoteAccessoryButtonIcon(context) {
    const editDisabled = !IsEditS4RelatedObjectEnabled(context);

    if (NotesListLibrary.isLogNote(context) || editDisabled) return '';
    return '$(PLT, /SAPAssetManager/Images/edit-accessory.ios.png, /SAPAssetManager/Images/edit-accessory.android.png, /SAPAssetManager/Images/edit-accessory.android.png)';
}
