import libCom from '../../../Common/Library/CommonLibrary';

export default function OnUOMChanged(context, binding = context.binding) {
    const uomControlValue = context._control.getValue()[0].ReturnValue;
    const uomMap = libCom.getStateVariable(context, 'WHIBD_EDT_UOMTempValueMap');
    
    uomMap.set(binding.ItemID, uomControlValue);
    libCom.setStateVariable(context, 'WHIBD_EDT_UOMTempValueMap', uomMap);
    libCom.setStateVariable(context, 'ResetQtyDueToUOM', true);

    // Handles initialization explicitly because the OnLoaded event of the EDT extension is not invoked automatically.
    if (libCom.getPreviousPageName(context) === 'WHInboundDeliveryEditAllItemsPage') {
        const previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');    
        const edts = previousPage.getControls()[0].getSections();
        
        for (let i = 1; i < edts.length; i += 2) {
            const edt = edts[i].getExtension();
            const uomCell = edt.getRowCellByName(0, 'UOM');
            const itemID = uomCell.context.binding.ItemID;
            const uomTempValue = uomMap.get(itemID);
            //Let's check if we are in the correct EDT to be updated
            if (uomTempValue) {
                uomCell.setValue(uomTempValue);
                uomCell.setDisplayValue(uomTempValue);
            }
        }
    }
}
