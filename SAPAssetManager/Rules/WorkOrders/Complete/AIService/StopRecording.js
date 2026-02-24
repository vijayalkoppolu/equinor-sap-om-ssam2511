/**
 * Stops the speech recording service and updates the button state based on the current transcription.
 * 
 * @param {IClientAPI} context - The client API context.
 * @returns {Promise<void>} A promise that resolves when the recording has stopped and the button state is updated.
 */

import TelemetryLibrary from '../../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import Logger from '../../../Log/Logger';
import ProcessRecordedText from './ProcessRecordedText';
import SpeechService from './SpeechService';
import updateButtonStateMachine from './UpdateButtonState';
export default async function StopRecording(context) {
    const speechService = SpeechService.getInstance();
    const currentTranscription = context.getPageProxy().getControl('SectionedTable').getControl('FreeTextControl').getValue();
    try {
        TelemetryLibrary.logUserEvent(context,
            context.getGlobalDefinition('/SAPAssetManager/Globals/Features/AIJobComplete.global').getValue(),
            TelemetryLibrary.EVENT_TYPE_STOP);
        await speechService.stopListening();
        ProcessRecordedText(context, currentTranscription);
    } catch (error) {
        Logger.error('Stop Recording', error);
    } finally {
        if (currentTranscription)  {
            updateButtonStateMachine(context, 'submit');
        } else {
            updateButtonStateMachine(context, 'start');
        }
    }
}
