/**
* Returns the passphrase value from the control in base64 format.
* @param {IClientAPI} context
*/
import libBase64 from '../Common/Library/Base64Library';
import isAndroid from '../Common/IsAndroid';

export default function Passphrase(context) {
    const passphraseText = context.evaluateTargetPath('#Page:CreateDigitalSignature/#Control:passphrase/#Value');
    const passphraseBase64encoded = libBase64.transformStringToBase64(isAndroid(context), passphraseText);
    return passphraseBase64encoded;
}
