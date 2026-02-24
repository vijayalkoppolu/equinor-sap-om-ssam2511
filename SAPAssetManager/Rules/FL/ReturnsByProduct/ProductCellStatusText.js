import { ReturnsByProductStatusText } from '../Common/FLLibrary';

export default function ProductCellStatusText(context) {
    const key = ReturnsByProductStatusText[context.binding?.FldLogsReturnStatus];
    return key ? context.localizeText(key) : '';
}
