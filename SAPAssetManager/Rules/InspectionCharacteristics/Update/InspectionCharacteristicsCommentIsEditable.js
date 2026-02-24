
export default function InspectionCharacteristicsCommentIsEditable(control, binding = control.binding) { 
    return binding.NoCharRecordingFlag !== 'X';
}
