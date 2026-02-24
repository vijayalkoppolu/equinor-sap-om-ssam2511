import { ImageSource } from '@nativescript/core/image-source';
import { QrGenerator } from 'nativescript-qr-generator';
import libQR from './QRCodeLibrary';

/**
 * Routines for QR code generation and display
 */
export default class {

    /**
     * //Generate a new QR code and refresh the image screen control that displays it
     * @param {IClientAPI} context
     * @param {string} text
     * @param {ControlProxy} control
     */
    static generateQRCodeAndRefresh(context, text, control) {
        let clientData = context.getPageProxy().getClientData();
        clientData.QRCodeImageSource = libQR.generateQRCode(text);
        control.redraw();
    }

    /**
     * Generate a new QR Code from the passed in text
     * @param {*} text 
     * @returns 
     */
    static generateQRCode(text) {
        const result = new QrGenerator().generate(text);
        return new ImageSource(result);
    }

    /**
     * Format the raw image data for display in an image control
     * @param {*} rawImageData 
     * @returns 
     */
    static prepareDataForImage(rawImageData) {
        return 'data:image/png;base64,' + rawImageData.toBase64String('png');
    }
}
