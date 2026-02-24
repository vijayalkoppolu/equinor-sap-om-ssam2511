import SpeechService from './SpeechService';
import UpdateButtonState from './UpdateButtonState';

let typingTimer = null;

export default function RecordedTextChange(clientAPI) {
    const page = clientAPI.getPageProxy();
    const speechService = SpeechService.getInstance();
    
    const inputControl = page.getControl('SectionedTable').getControl('FreeTextControl');
    const submitButton = page.getControl('SectionedTable').getControl('SubmitButton');
    const stopRecordingButton = page.getControl('SectionedTable').getControl('StopRecording');

    clearTimeout(typingTimer); // Reset timer on every keystroke

    typingTimer = setTimeout(() => {
        const inputValue = inputControl.getValue()?.trim();
        
        if (speechService.listening) {
            return; 
        }

        if (inputValue) {
            if (!(submitButton.getVisible() && stopRecordingButton.getVisible())) {
                UpdateButtonState(clientAPI, 'process'); 
            }
        } else {
            UpdateButtonState(clientAPI, 'start'); 
        }
    }, 3000); // Wait for 3 seconds of inactivity
}
