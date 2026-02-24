import LocalizationLibrary from '../../../Common/Library/LocalizationLibrary';

export default async function LAMCharacteristicValueEndPoint(context) {
    let end = context.evaluateTargetPath('#Control:EndPoint/#Value').toString();

    if (LocalizationLibrary.isNumber(context, end)) {
        let formattedValue = await LocalizationLibrary.formatNumberToBackendSupportedFormat(context, end);
        return formattedValue;
    } 

    return end;
}
