import DeviceType from '../Common/DeviceType';
import libCom from '../Common/Library/CommonLibrary';

/**
 * Return the height and width of the QR code based on the device type.
 * @param {IClientAPI} context
 */
export default function DetermineQRCodeHeightWidth(context) {
    const deviceType = DeviceType(context);
   
    if (deviceType === 'Phone') {
        return 0;
    }
    
    if (libCom.getStateVariable(context, 'QRCodeExpiredDisplayed')) return 450; //Handle smaller expired image
    return 600;
}
