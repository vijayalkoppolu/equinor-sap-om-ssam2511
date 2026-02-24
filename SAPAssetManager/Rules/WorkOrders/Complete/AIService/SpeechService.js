import { Observable } from '@nativescript/core';
import { SpeechRecognition } from 'nativescript-speech-recognition';
import Logger from '../../../Log/Logger';


export default class SpeechService extends Observable {
    /**
     * Gets the singleton instance of SpeechService
     * @returns {SpeechService} The singleton instance
     */
    static getInstance() {
        return this.instance || (this.instance = new this());

    }

    constructor() {
        super();
        this.instance = null;
        this.speechRecognition = new SpeechRecognition();
        this.listening = false;
        this.timeoutId = null;
    }

    /**
     * Requests permission for speech recognition
     * @returns {Promise<boolean>} A promise that resolves to true if permission is granted, false otherwise
     */
    async requestPermission() {
        try {
            // Request permission from the speech recognition package
            const granted = await this.speechRecognition.requestPermission();
            Logger.info('Speech permission granted?', granted);
            return granted;
        } catch (error) {
            Logger.error('Error requesting speech permission:', error);
            return false;
        }
    }

    /**
     * Checks if speech recognition is available on the device
     * @returns {Promise<boolean>} A promise that resolves to true if available, false otherwise
     */
    async isAvailable() {
        try {
            // Check availability using the speech recognition package
            return await this.speechRecognition.available();
        } catch (error) {
            Logger.error('Error checking speech recognition availability:', error);
            return false;
        }
    }

    /**
     * Starts listening for speech input
     * @param {string} locale - The locale (language) for speech recognition (default: 'en-GB' )
     * 'en-US' was said to have issues earlier in development but may have been resolved
     * @param {Function} onTranscription - Callback function for transcription results
     * @param {Function} onError - Callback function for errors
     */
    async startListening(onTranscription, onError) {
        if (this.listening) {
            Logger.error('Already listening. Stopping current session before starting a new one.');
            await this.stopListening();
        }

        if (!(await this.isAvailable())) {
            onError('Speech recognition not available');
            return;
        }

        try {
            // Start listening using the speech recognition package
            // returnPartialResults controls "live" aspect of transcription
            await this.speechRecognition.startListening({
                returnPartialResults: true,
                onResult: onTranscription,
                onError: (error) => {
                    Logger.error('Speech recognition error:', error);
                    onError(error);
                    this.listening = false;
                },
            });
            this.listening = true;
            Logger.info('Started listening to speech');

            // Set a timeout to automatically stop listening after 30 seconds
            this.timeoutId = setTimeout(() => {
                Logger.info(`Automatic timeout after ${30000} seconds`);
                this.stopListening();
            }, 30000);
        } catch (error) {
            Logger.error('Error while trying to start listening:', error);
            onError(error);
        }
    }

    /**
     * Stops listening for speech input
     */
    async stopListening() {
        if (!this.listening) {
            Logger.info('Not currently listening.');
            return;
        }

        try {
            clearTimeout(this.timeoutId);
            // Stop listening using the speech recognition package
            await this.speechRecognition.stopListening();
            this.listening = false;
            Logger.info('Stopped listening!');
        } catch (error) {
            Logger.error('Error while trying to stop listening:', error);
            // Force reset the listening state even if there's an error
            this.listening = false;
        }
    }
}
