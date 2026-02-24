export default function ResvItemStatusValue(context) {
    if (context.binding['@odata.readLink'].includes('FldLogsWoResvItems')) {
        let screenQty = Number(context.getPageProxy().getControl('FormCellContainer').getControl('WithdrawnQuantity').getValue());
        let withdrawnQty = context.binding.WithdrawnQty;
        if (context.binding.EntryQty !== screenQty) { //Quantity not changed so status remains same
           withdrawnQty = context.binding.WithdrawnQty + (context.binding.EntryQty - screenQty);
        } 
        return withdrawnQty === 0 ? 'R' : ''; 
    } else if (context.binding['@odata.readLink'].includes('FldLogsWoProducts')) {
        return 'R';
    }
    return '';
}

