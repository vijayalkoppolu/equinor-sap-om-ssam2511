import libCom from '../../../Common/Library/CommonLibrary';
/**
* Navigates to the Serial Number screen
* @param {IClientAPI} clientAPI
*/
export default function SerialNav(context) {
    const control = context.getPageProxy().getControl('FormCellContainer');
    updateEntryQuantity(control, context);
    libCom.removeStateVariable(context, 'SerialSuccess');
    return context.executeAction('/SAPAssetManager/Actions/EWM/PhysicalInventory/PhysicalInventorySerialNumbersNav.action');
}

export function updateEntryQuantity(control, context) {
    const quantity = Number(control.getControl('QuantitySimple').getValue());
    libCom.setStateVariable(context, 'Quantity', quantity);
    if (context.binding) {
        context.binding.Quantity = quantity;
    } else {
        const binding = { Quantity: quantity };
        context.getPageProxy().setActionBinding(binding);
    }
    return context;
}
