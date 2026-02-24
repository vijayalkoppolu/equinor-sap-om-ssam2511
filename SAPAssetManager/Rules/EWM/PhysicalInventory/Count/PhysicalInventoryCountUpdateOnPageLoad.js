import libCom from '../../../Common/Library/CommonLibrary';
import hideCancel from '../../../ErrorArchive/HideCancelForErrorArchiveFix';
import { PhysicalInventoryStatus } from '../../Common/EWMLibrary';
/**
 * This rule is used to set the initial values of the page and to disable the quantity field if the zero count is set.
 */

export default function PhysicalInventoryCountUpdateOnPageLoad(context) {
    hideCancel(context);
    libCom.saveInitialValues(context);

    let quantity = libCom.getControlProxy(context, 'QuantitySimple');
    let zero = context.binding.ZeroCount;
    if (zero === 'X') { //Disable quantity if zero count set
        quantity.setValue('0');
        quantity.setEditable(false);
        quantity.setHelperText('');
    }
    if (context.binding.Serialized) {
        quantity.setEditable(false);
        const selectedSerialNum = context.binding.WarehousePhysicalInventoryItemSerial_Nav.filter(item => item.Selected);
        libCom.setStateVariable(context, 'SerialNumbers', { actual: null, initial: selectedSerialNum});
    }
    let query = "$orderby=ITEM_NO&$filter=GUID eq '" + context.binding.GUID +
        "' and PIStatus ne '" + PhysicalInventoryStatus.Counted +
        "' and PIStatus ne '" + PhysicalInventoryStatus.Posted +
        "' and PIStatus ne '" + PhysicalInventoryStatus.Recounted + "'";
    context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehousePhysicalInventoryItems', [], query).then(function(results) {
        if (results && results._array.length > 0) {

            const currentIndex = results._array.findIndex(item => item.ITEM_NO === context.binding.ITEM_NO);
            const previousItem = currentIndex > 0 ? results._array[currentIndex - 1] : null; // Get previous item
            const nextItem = currentIndex < results._array.length - 1 ? results._array[currentIndex + 1] : null; // Get next item
            if (previousItem) {
                libCom.setStateVariable(context, 'WHPreviousItem', previousItem);
            } else {
                libCom.removeStateVariable(context, 'WHPreviousItem');
            }
            if (nextItem) {
                libCom.setStateVariable(context, 'WHNextItem', nextItem);
            } else {
                libCom.removeStateVariable(context, 'WHNextItem');
            }
            context.getFioriToolbar().redraw();
        } else {
            libCom.removeStateVariable(context, 'WHPreviousItem');
            libCom.removeStateVariable(context, 'WHNextItem');
        }
    });
    return true;
}
