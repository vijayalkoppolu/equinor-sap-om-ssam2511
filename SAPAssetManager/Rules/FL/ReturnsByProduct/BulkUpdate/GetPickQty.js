import libLocal from '../../../Common/Library/LocalizationLibrary';
export default function GetPickQty(context) {
    
    let pickQty = context.binding.LoadingQtyInOrderUnit;
        if (typeof pickQty === 'string') {
            return libLocal.toNumber(context, pickQty);
        } else {
            return pickQty;
        }
}
