
import LocalizationLibrary from '../Common/Library/LocalizationLibrary';
import lamFormat from './LAMFormatLAMField';

export default async function LAMLengthFormat(context) {
    let value = await LocalizationLibrary.formatBackendValueToNumber(context, context.binding.Length);
    let uom = context.binding.UOM;

    return lamFormat(context, value, uom);
}
