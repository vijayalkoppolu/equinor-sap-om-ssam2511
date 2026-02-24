import libCom from '../../../Common/Library/CommonLibrary';
import validateData from './WHValidatePhysicalInventoryCount';
import postSerial from './PhysicalInventoryDocItemSerialPost';
import { PhysicalInventoryStatus } from '../../Common/EWMLibrary';
/**
 * Post the physical inventory count for the current item
 * @param {*} context
 * @param {*} done - Did user press done button, or next button?
 * @returns
 */
export default function PhysicalInventoryDocItemPost(context, done = true, itemsMap) {

    let binding = context.binding;
    const pageProxy = context.getPageProxy();
    binding.TempHeader_Key = binding.PIDocumentNo + binding.DocumentYear + binding.ITEM_NO;
    binding.Temp_PIItemReadlink = binding['@odata.readLink'];
    binding.Temp_Quantity = libCom.getControlProxy(pageProxy, 'QuantitySimple').getValue().toString();
    binding.Temp_ZeroCount = libCom.getControlProxy(pageProxy, 'ZeroCountSwitch').getValue() === true ? 'X' : '';
    binding.Temp_EmptyBin = libCom.getControlProxy(pageProxy, 'EmptyBinSwitch').getValue() === true ? 'X' : '';
    binding.Temp_HUComplete = libCom.getControlProxy(pageProxy, 'HUCompleteSwitch').getValue() === true ? 'X' : '';
    binding.Temp_EmptyHU = libCom.getControlProxy(pageProxy, 'EmptyHUSwitch').getValue() === true ? 'X' : '';
    binding.Temp_HUMissing = libCom.getControlProxy(pageProxy, 'HUMissingSwitch').getValue() === true ? 'X' : '';
    binding.Temp_UOM = binding.UOM;
    binding.Temp_WarehouseNo = binding.WarehouseNo;
    return validateData(context).then(valid => {
        if (valid) {
            binding.Temp_PIStatus = PhysicalInventoryStatus.Posted;
            return updateItem(context.getPageProxy(), itemsMap, done);
        }
        return false; //Validation failed
    });
}

/**
 * save the current line item and process the next in the itemsMap
 * @param {*} context
 * @returns
 */
function updateItem(context, itemsMap, done) {
    //Update the item count
    return PostItemUpdate(context).then(() => {
        //Remove serial state variables after they have been processed
        if (!done) { //User hit next button
            context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessMessage.action');
            if (itemsMap) {
                context.setActionBinding(itemsMap);
                let page = context.getPageDefinition('/SAPAssetManager/Pages/EWM/PhysicalInventory/WHPhysicalInventoryCount.page');
                page._Name = itemsMap.ITEM_NO;

                return context.executeAction({ //Move to the next item in the list, using same open transaction screen
                    'Name': '/SAPAssetManager/Actions/EWM/PhysicalInventory/PhysicalInvCountNav.action',
                    'Properties': {
                        'PageMetadata': page,
                        '_Type': 'Action.Type.Navigation',
                        'ModalPage': true,
                        'ClearHistory': true,
                        'PageToOpen': '/SAPAssetManager/Pages/Inventory/PhysicalInventory/Empty.page',
                        'NavigationType': 'Inner',
                    },
                });
            }
        }
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessWithClose.action');
    });
}

function PostItemUpdate(context) {
    return context.executeAction('/SAPAssetManager/Actions/EWM/PhysicalInventory/PhysicalInventoryDocItemCount.action').then(() => {
        return postSerial(context);
    });
}
