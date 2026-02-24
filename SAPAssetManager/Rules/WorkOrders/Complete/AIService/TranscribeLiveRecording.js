
import handleStopListening from './StopRecording';
import updateButtonStateMachine from './UpdateButtonState';
import Logger from '../../../Log/Logger';
import SpeechService from './SpeechService';
import TelemetryLibrary from '../../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
/**
 * SpeechService class: Manages speech recognition functionality
 * Uses a singleton pattern to ensure consistent state across the application
 */


export default async function TranscribeLiveRecording(context) {
    const speechService = SpeechService.getInstance();
    let currentTranscription = '';

    function updateFreeTextControlValue(text) {
        const freeTextControl = context.getPageProxy().getControl('SectionedTable').getControl('FreeTextControl');
        freeTextControl.setValue(text);
    }

    async function handleStartListening() {
        TelemetryLibrary.logUserEvent(context,
            context.getGlobalDefinition('/SAPAssetManager/Globals/Features/AIJobComplete.global').getValue(),
            TelemetryLibrary.EVENT_TYPE_START);      
        updateButtonStateMachine(context, 'stop');
        updateFreeTextControlValue('');

        await speechService.startListening(
            (transcription) => {
                currentTranscription = transcription.text;
                updateFreeTextControlValue(currentTranscription);
            },
            (error) => {
                Logger.error('Speech Recognition:', error);
                handleStopListening(context);
                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/ErrorBannerMessage.action',
                    'Properties': {
                        'Message': error,
                    },
                });         
            },
        );
    }

    // Main function logic
    try {
        const permissionGranted = await speechService.requestPermission();
        if (!permissionGranted) {
            throw new Error('Speech recognition permission not granted');
        }
        await handleStartListening();
    } catch (error) {
        Logger.error('TranscribeLiveRecording:', error);
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/ErrorBannerMessage.action',
            'Properties': {
                'Message': error,
            },
        });  
    } 
        
}
