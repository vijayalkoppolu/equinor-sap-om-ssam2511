import IsAndroid from '../../../../Common/IsAndroid';
import libCom from '../../../../Common/Library/CommonLibrary';
import IBDSerialNumberAcceptAllButtonIsEnabled from './IBDSerialNumberAcceptAllButtonIsEnabled';

async function BuildSerialNumberMap(context, binding = context.getPageProxy().getActionBinding()) {

    let serialNumberMap = [];
    const serialized = binding.Serialized;

    if (serialized) {

        const result = await context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/SerialNumber_Nav`, [], '');
        if (result && result.length > 0) {
            serialNumberMap = result.map(item => {
                return {
                    entry: item,
                    selected: false,
                    downloaded: !libCom.isCurrentReadLinkLocal(item['@odata.readLink']),
                    entityexist: true,
                };
            });
        }
    
        serialNumberMap.sort((a, b) => { 
            if (a.downloaded === b.downloaded) {
                return a.entry.SerialNumber > b.entry.SerialNumber ? 1 : -1; 
            }
            return a.downloaded > b.downloaded ? 1 : -1; 
        });

        UpdateIBDSerialNumberMap(context, serialNumberMap);
        return serialNumberMap;
    }
}

export function GetIBDSerialNumbers(context) {
    return libCom.getStateVariable(context, 'IBDSerialNumbers');
}

export function UpdateIBDSerialNumberMap(context, serialNumberMap) {
    libCom.setStateVariable(context, 'IBDSerialNumbers', serialNumberMap);
}

export async function CreateSerialMap(context, binding = context.binding) {
    return await BuildSerialNumberMap(context, binding);
}

export function GetIbdSerialNumberCount(context) {
    const map = GetIBDSerialNumbers(context);
    return map ? map.length : 0;
}

export function AddNewItemSerial(context, serialmap, serialnumber) {
    let serialNumberMap = serialmap;
    const newEntry = { 
        DocumentID: context.binding.DocumentID,
        ItemID: context.binding.ItemID,
        SerialNumber: serialnumber,
    };

    const newSerialNumber = {
        entry: newEntry,
        selected: true,
        downloaded: false,
        entityexist: false,
    };

    serialNumberMap.unshift(newSerialNumber);
    UpdateIBDSerialNumberMap(context, serialNumberMap);
}

export function UpdateIBDControls(context, serialNumberMap) {
    const quantitySerNum = parseInt(GetIBDSelectedCount(serialNumberMap));
    const quantityToConfirm = parseInt(context.getPageProxy().evaluateTargetPath('#Page:-Previous/#Control:QuantityInput').getValue());
    const quantity = quantityToConfirm - quantitySerNum;
    const sectTable = context.getPageProxy().getControl('SectionedTable');
    const scanButton = sectTable.getControl('ScanButton');
    const acceptAllButton = context.getPageProxy().getFioriToolbar().getItem('AcceptAllTbI');
    scanButton.setTitle(context.localizeText('scan_serial_number', [quantity]));
    scanButton.setEnable(quantity > 0);
    sectTable.getControl('SerialNum').setEnable(quantity > 0);
    acceptAllButton.setEnabled(IBDSerialNumberAcceptAllButtonIsEnabled(context));
    return Redraw(context);
}

export function GetIBDSelectedCount(serialNumberMap) {
    return serialNumberMap.reduce((accumulator, currentValue) => accumulator + (currentValue.selected ? 1 : 0), 0);
}

export function Redraw(context) {
    return context
        .getPageProxy()
        .getControl('SectionedTable')
        .getSection(`${IsAndroid(context) ? 'SerialNumbersObjectTableAndroid' : 'SerialNumbersObjectTable'}`)
        .redraw();
}

export function ValidateSerialQuantity(context) {
    const serialNumberMap = GetIBDSerialNumbers(context);
    const enteredQuantity = parseFloat(context.evaluateTargetPath('#Page:EditInboundDeliveryItemPage/#Control:QuantityInput/#Value'));
    
    if (serialNumberMap && enteredQuantity) {
        return Promise.resolve(GetIBDSelectedCount(serialNumberMap) === enteredQuantity);
    } else {
        return Promise.reject();
    }
}

export function IBDGetSerialNumberScanEnabled(context) {
    const quantityToConfirm = parseInt(context.getPageProxy().evaluateTargetPath('#Page:-Previous/#Control:QuantityInput').getValue());
    const selectedCount = GetIBDSelectedCount(GetIBDSerialNumbers(context));
    return (quantityToConfirm - selectedCount) > 0;
}
