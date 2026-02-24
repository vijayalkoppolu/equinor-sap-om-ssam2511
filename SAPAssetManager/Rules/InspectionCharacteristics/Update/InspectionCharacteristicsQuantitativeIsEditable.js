import inspCharLib from './InspectionCharacteristics';

export default function InspectionCharacteristicsQuantitativeIsEditable(context, binding = context.binding) {
    if (inspCharLib.isCalculatedAndQuantitative(binding)) {
        return false;
    }
    return ![binding.AfterAcceptance, binding.AfterRejection, binding.NoCharRecordingFlag].includes('X');
}
