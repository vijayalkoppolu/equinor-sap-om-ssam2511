import LocalizationLibrary from '../../../Common/Library/LocalizationLibrary';

export default async function LAMCharacteristicValueLength(context) {
    let length = context.evaluateTargetPath('#Control:Length/#Value').toString();

    if (LocalizationLibrary.isNumber(context, length)) {
        let formattedValue = await LocalizationLibrary.formatNumberToBackendSupportedFormat(context, length);
        return formattedValue;
    } 

    return length;
}
