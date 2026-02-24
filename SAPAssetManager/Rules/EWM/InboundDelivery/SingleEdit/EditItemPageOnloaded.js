import libCom from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';

export default function EditItemPageOnloaded(context, itemID = context.binding.ItemID) {
    const controls = context.getControls?.()?.[0].getSections?.()?.[2].getControls?.();
    if (!controls) {
        Logger.error("Referenced Control doesn't exist in Edit Single Item Page");
    }
    const quantityControl = controls?.[0];
    const uomControl = controls?.[1];
    const stockTypeControl = controls?.[2];
    
    const quantityMap = libCom.getStateVariable(context, 'WHIBD_EDT_QuantityTempValueMap');
    const uomMap = libCom.getStateVariable(context, 'WHIBD_EDT_UOMTempValueMap');
    const stockTypeMap = libCom.getStateVariable(context, 'WHIBD_EDT_StockTypeTempValueMap');
    
    if (quantityMap.has(itemID) && quantityControl) {
        quantityControl.setValue(quantityMap.get(itemID));
    }
    if (uomMap.has(itemID) && uomControl) {
        uomControl.setValue(uomMap.get(itemID));
    }
    if (stockTypeMap.has(itemID) && stockTypeControl) {
        stockTypeControl.setValue(stockTypeMap.get(itemID));
    }
}
