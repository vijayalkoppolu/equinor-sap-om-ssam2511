
import LocalizationLibrary from '../Common/Library/LocalizationLibrary';
import lamFormat from './LAMFormatLAMField';

export default async function LAMEndPointFormat(context) {
    let value = await LocalizationLibrary.formatBackendValueToNumber(context, context.binding.EndPoint);
    let uom = context.binding.UOM;

    return lamFormat(context, value, uom);
}
