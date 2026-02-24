import libCom from '../../../Common/Library/CommonLibrary';

export default function OnStockTypeChanged(context, binding = context.binding) {
    const stockTypeControlValue = context._control.getValue()[0].ReturnValue;
    const stockTypeMap = libCom.getStateVariable(context, 'WHIBD_EDT_StockTypeTempValueMap');

    stockTypeMap.set(binding.ItemID, stockTypeControlValue);
    libCom.setStateVariable(context, 'WHIBD_EDT_StockTypeTempValueMap', stockTypeMap);

    // Handles initialization explicitly because the OnLoaded event of the EDT extension is not invoked automatically.
    if (libCom.getPreviousPageName(context) === 'WHInboundDeliveryEditAllItemsPage') {
        const previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');    
        const edts = previousPage.getControls()[0].getSections();
    
        for (let i = 1; i < edts.length; i += 2) {
            const edt = edts[i].getExtension();
            const stockTypeCell = edt.getRowCellByName(0, 'StockType');
            const itemID = stockTypeCell.context.binding.ItemID;
            const stockTypeTempValue = stockTypeMap.get(itemID);
            //Let's check if we are in the correct EDT to be updated
            if (stockTypeTempValue) {
                stockTypeCell.setValue(stockTypeTempValue);
                stockTypeCell.setDisplayValue(stockTypeTempValue);
            }
        }
    }
}
