import libQR from '../Common/Library/QRCodeLibrary';
import libCom from '../Common/Library/CommonLibrary';

/**
* Sets the QR Code data for this image control
* @param {IClientAPI} context
*/
export default function GetQRCodeImage(context) {
    let imageRawData = context.getPageProxy()?.getClientData()?.QRCodeImageSource;

    if (imageRawData) {
        if (libCom.getStateVariable(context, 'QRCodeExpiredDisplayed')) {
            return imageRawData; //Display expired image
        }
        return libQR.prepareDataForImage(imageRawData); //Display QR-Code
    }

    return '';
}
