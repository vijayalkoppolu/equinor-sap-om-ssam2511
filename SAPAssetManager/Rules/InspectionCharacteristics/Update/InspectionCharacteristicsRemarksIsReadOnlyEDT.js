/**
* Disable Remarks/Comment section if NoCharRecordingFlag for the characteristics is 'X'
* @param {IClientAPI} clientAPI
*/
export default function InspectionCharacteristicsRemarksIsReadOnlyEDT(context) {
    return !!(context.binding.NoCharRecordingFlag && context.binding.NoCharRecordingFlag === 'X');
}
