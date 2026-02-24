import libLocal from '../../../Common/Library/LocalizationLibrary';
export default function GetEntryQty(context) {
    let entryQty = context.binding.EntryQty;
    if (typeof entryQty === 'string') {
        return libLocal.toNumber(context, entryQty);
    } else {
        return entryQty;
    }
}
