/**
 * Determines if a qualitative inspection characteristic is editable.
 * @param {IClientAPI} context - The client API context object
 * @param {Object} [binding=context.binding] - The data binding object containing characteristic properties
 * @returns {boolean} True if the characteristic is editable, false otherwise
 */
export default function InspectionCharacteristicsQualitativeIsEditable(context, binding = context.binding) {
    return (binding.RequiredChar === 'X' || binding.OptionalChar === 'X') && !binding.NoCharRecordingFlag;
}
