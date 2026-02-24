import libCom from '../../../Common/Library/CommonLibrary';
export default function WithdrwanQtyAdjustValue(context) {

     let withdrawnQty = context.binding.WithdrawnQty;
        const screenQty = Number(context.getPageProxy().getControl('FormCellContainer').getControl('WithdrawnQuantity').getValue());
        libCom.setStateVariable(context, 'EntryQtyOld', context.binding.EntryQty);
        if (context.binding.EntryQty !== screenQty ) {
            if (context.binding.EntryQty === 0) {
                return withdrawnQty - screenQty;
            }
            if (context.binding.EntryQty < screenQty) {
                withdrawnQty = context.binding.WithdrawnQty - (screenQty - context.binding.EntryQty );
            } else {
                withdrawnQty = context.binding.WithdrawnQty + (context.binding.EntryQty - screenQty);
            }
        } 
        return withdrawnQty;
}


