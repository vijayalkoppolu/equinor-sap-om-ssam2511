import LocalizationLibrary from '../../../Common/Library/LocalizationLibrary';

export default async function LAMCharacteristicValueStartPoint(context) {
    let start = context.evaluateTargetPath('#Control:StartPoint/#Value').toString();

    if (LocalizationLibrary.isNumber(context, start)) {
        let formattedValue = await LocalizationLibrary.formatNumberToBackendSupportedFormat(context, start);
        return formattedValue;
    } 

    return start;
}
