import libCom from '../../../Common/Library/CommonLibrary';
/**
 * Post the serial numbers for the physical inventory doc item
 * @param {*} context 
 * @returns 
 */
export default function PhysicalInventoryDocItemSerialPost(context) {
    let binding = context.binding;
    if (binding.Serialized) {//Check if serialized material

        let oldRows = binding.WarehousePhysicalInventoryItemSerial_Nav;//Current rows in entity for this item
        const currentRows = libCom.getStateVariable(context, 'SerialNumbers').initial;
        binding.TempHeader_Key = binding.PIDocumentNo + binding.DocumentYear + binding.ITEM_NO; //Used for transactionID in action
        binding.TempHeader_ReadLink = binding['@odata.readLink']; //Used for linking related entity action

        return DeleteOldSerialLoop(context, oldRows).then(() => { //Delete obsolete numbers
            return AddNewSerialLoop(context, currentRows); //Add new numbers
        });
    }
    return Promise.resolve(true);
}

//Loop over old serial numbers and delete them if they are not in the latest changes from user
export function DeleteOldSerialLoop(context, oldSerialNumbers) {

    if (oldSerialNumbers && oldSerialNumbers.length > 0) {
        let row = oldSerialNumbers[0];
        libCom.setStateVariable(context, 'TempSerial_ReadLink', row['@odata.readLink']);
        return context.executeAction('/SAPAssetManager/Actions/EWM/PhysicalInventory/PhysicalInventoryDocItemSerialsDelete.action').then(() => {
            oldSerialNumbers.shift(); //Drop the first row in the array
            return DeleteOldSerialLoop(context, oldSerialNumbers); //Recursively process the next item
        });
    }
    return Promise.resolve(true); //No more serial numbers
}

//Loop over current serial number cache and add new ones to the entity
export function AddNewSerialLoop(context, serialArray, isCreate) {
    if (serialArray.length > 0) {
        let row = serialArray[0];
        let binding = context.binding;
        let action = '/SAPAssetManager/Actions/EWM/PhysicalInventory/PhysicalInventoryDocItemSerialsCreateRelated.action';

        binding.TempSerial_GUID = binding.GUID;
        binding.TempSerial_Item = binding.ITEM_NO;
        binding.TempSerial_SerialNumber = row.SerialNumber;
        binding.TempSerial_Selected = row.Selected ? 'X' : '';

        return context.executeAction(action).then(() => {
            serialArray.shift();
            return AddNewSerialLoop(context, serialArray, isCreate);
        });
    }
    return Promise.resolve(true); //No more serial numbers
}
