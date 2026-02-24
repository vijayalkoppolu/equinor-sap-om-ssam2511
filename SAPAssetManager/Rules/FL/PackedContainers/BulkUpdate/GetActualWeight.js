import libLocal from '../../../Common/Library/LocalizationLibrary';
export default function GetActualWeight(context) {
    return libLocal.toNumber(context, context.binding.FldLogsCtnActualWeight);
}
