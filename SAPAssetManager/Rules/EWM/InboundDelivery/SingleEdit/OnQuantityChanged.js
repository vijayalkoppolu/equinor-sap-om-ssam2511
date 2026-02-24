import libCom from '../../../Common/Library/CommonLibrary';

export default function OnQuantityChanged(context, binding = context.binding) {
    const quantityControlValue = Number(context._control.getValue());
    const quantityMap = libCom.getStateVariable(context, 'WHIBD_EDT_QuantityTempValueMap');

    quantityMap.set(binding.ItemID, quantityControlValue);
    libCom.setStateVariable(context, 'WHIBD_EDT_QuantityTempValueMap', quantityMap);
    
    // Handles initialization explicitly because the OnLoaded event of the EDT extension is not invoked automatically.
    if (libCom.getPreviousPageName(context) === 'WHInboundDeliveryEditAllItemsPage') {
        const previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');    
        const edts = previousPage.getControls()[0].getSections();

        for (let i = 1; i < edts.length; i += 2) {
            const edt = edts[i].getExtension();
            const quantityCell = edt.getRowCellByName(0, 'Quantity');
            const itemID = quantityCell.context.binding.ItemID;
            const quantityTempValue = quantityMap.get(itemID);
            //Let's check if we are in the correct EDT to be updated
            if (quantityTempValue !== undefined) {
                quantityCell.setValue(quantityTempValue);
            }
        }
    }
}
