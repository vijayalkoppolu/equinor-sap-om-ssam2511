import IsSelectionModeEnabled from './IsSelectionModeEnabled';

export default function SelectionModeOnLongPress(context) {
    return IsSelectionModeEnabled(context) ? 'Multiple' : 'None';
}
