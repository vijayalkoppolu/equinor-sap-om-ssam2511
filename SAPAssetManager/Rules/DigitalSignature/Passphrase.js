/**
* Returns the passphrase value from the control and encodes it to base64.
* @param {IClientAPI} context
*/
import libBase64 from '../Common/Library/Base64Library';
import isAndroid from '../Common/IsAndroid';

export default function Passphrase(context) {
    const passphraseText = context.evaluateTargetPath('#Page:PassphraseTOTP/#Control:passphrase/#Value');
    const passphraseBase64encoded = libBase64.transformStringToBase64(isAndroid(context), passphraseText);
    return passphraseBase64encoded;
}
