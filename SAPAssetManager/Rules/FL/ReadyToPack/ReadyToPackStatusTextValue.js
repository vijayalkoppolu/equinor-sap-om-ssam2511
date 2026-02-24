import { ReadyToPackStatusText } from '../Common/FLLibrary';

export default function ReadyToPackStatusTextValue(context) {
    const key = ReadyToPackStatusText[context.binding?.FldLogsShptItmStsCode];
    return key ? context.localizeText(key) : '';
}
