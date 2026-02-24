import libCom from '../../../Common/Library/CommonLibrary';
import IsAndroid from '../../../Common/IsAndroid';
import IsIOS from '../../../Common/IsIOS';
import { isTaskWithSerialNumbers } from '../../Common/EWMLibrary';
import { getWarehouseTaskItem } from '../Confirmation/WarehouseTaskConfirmationItem';
import Logger from '../../../Log/Logger';
import ODataLibrary from '../../../OData/ODataLibrary';


export const EWM_WT_SERIAL_MAP = 'EWM_WT_SERIAL_MAP';
export const EWM_WT_SERIAL_CONF_RECORDS = 'EWM_WT_SERIAL_CONF_RECORDS';
export const EWM_WT_ITEM_CURRENT = 'EWM_WT_ITEM_CURRENT';

/**
 * Remove the serial number map state variable
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 */
export function RemoveSerialNumberMap(context) {
    libCom.removeStateVariable(context, [
        EWM_WT_SERIAL_MAP,
        EWM_WT_SERIAL_CONF_RECORDS,
        EWM_WT_ITEM_CURRENT,
    ]);
    Logger.debug('RemoveSerialNumberMap', 'Serial number map removed');
}

/**
 * Set the map only to display the serial numbers in the task details page
 * @param {IClientAPI} context 
 * @returns 
 */
export async function SetSerialNumberMapForDisplay(context) {
    return await SetSerialNumberMapImpl(context, false, false);
}

/**
 * Set the map for confirmations
 * @param {IClientAPI} context 
 * @returns 
 */
export async function SetSerialNumberMap(context) {
    return await SetSerialNumberMapImpl(context);
}

/**
 * Set the serial number map state variable implementation
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 */
async function SetSerialNumberMapImpl(context, isUseCurrentTask = true, isSetStateVar = true) {
    Logger.debug('SetSerialNumberMapImpl', `isUseCurrentTask: ${isUseCurrentTask}, isSetStateVar: ${isSetStateVar}`);
    const whTaskConfEdit = context.binding['@odata.type'].split('.')[1] === 'WarehouseTaskConfirmation';
    const initBinding = whTaskConfEdit ? context.binding.WarehouseTask_Nav : context.binding;
    let serialNumberMap = [];

    if (isTaskWithSerialNumbers(context, initBinding)) {
        const binding = initBinding?.WarehouseTaskSerialNumber_Nav ? initBinding : context.getPageProxy().getActionBinding();

        let warehouseTaskItem = undefined;
        if (isUseCurrentTask) {
            warehouseTaskItem = whTaskConfEdit ? context.binding.WarehouseTaskItem : await getWarehouseTaskItem(context);
            libCom.setStateVariable(context, EWM_WT_ITEM_CURRENT, warehouseTaskItem);
        }

        const result = await context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTaskSerialNumbers', [], `$filter=(WarehouseNo eq'${binding.WarehouseNo}') and (WarehouseTask eq '${binding.WarehouseTask}')`);
        if (result && result.length > 0) {
            serialNumberMap = result.map(item => {
                return {
                    entry: item,
                    selected: false,
                    downloaded: !ODataLibrary.isLocal(item) || !!item.FromDelivery,
                    usedInOtherConfirmation: undefined,
                };
            });
        }
    
        // Update the serial number map with the confirmed serial numbers
        const serialConfRecords = await updateSerialMapWithConfirmations(context, binding, warehouseTaskItem, serialNumberMap);
        // sort the serial numbers to keep new on top
        serialNumberMap.sort((a, b) => { 
            if (a.downloaded === b.downloaded) {
                return a.entry.SerialNumber > b.entry.SerialNumber ? 1 : -1; 
            }
            return a.downloaded > b.downloaded ? 1 : -1; 
        });        
        if (isSetStateVar) {
            libCom.setStateVariable(context, EWM_WT_SERIAL_CONF_RECORDS, serialConfRecords);
            libCom.setStateVariable(context, EWM_WT_SERIAL_MAP, serialNumberMap);
        }
        return serialNumberMap;
    }
}

/**
 * Update Serial Numbers map with existing confirmations
 * @param {IClientAPI} context 
 * @param {Object} binding 
 * @param {String} warehouseTaskItem 
 * @param {Array} serialNumberMap 
 * @returns 
 */
async function updateSerialMapWithConfirmations(context, binding, warehouseTaskItem, serialNumberMap) {
    Logger.debug('updateSerialMapWithConfirmations', `warehouseTaskItem: ${warehouseTaskItem}`);
    if (serialNumberMap.length > 0) {
        let result = [];
        try {
            result = await context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTaskConfSerialNumbers', ['SerialNumber', 'WarehouseTaskItem', 'WarehouseTask'], `$filter=(WarehouseNo eq'${binding.WarehouseNo}') and (WarehouseTask eq '${binding.WarehouseTask}')`);
        } catch (error) {
            Logger.error('updateSerialMapWithConfirmations', `Error reading WarehouseTaskConfSerialNumbers: ${error}`);
            return [];
        }   
        if (result && result.length > 0) {
            Logger.debug('updateSerialMapWithConfirmations - updating SN map');
            result.forEach(element => {
                const confirmed = serialNumberMap.find(item => item.entry.SerialNumber === element.SerialNumber);
                if (confirmed) {
                    if (warehouseTaskItem && element.WarehouseTaskItem === warehouseTaskItem) {
                        // confirmed for this warehouse task item
                        confirmed.selected = true;
                    } else {
                        // confirmed for another warehouse task item
                        confirmed.usedInOtherConfirmation = element;
                    }
                }
            });
            return result.filter(item => item.WarehouseTaskItem === warehouseTaskItem);
        }
    }
    return [];
}

/**
 * Set the serial number map state variable
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 */
export function UpdateSerialNumberMap(context, serialNumberMap) {
    libCom.setStateVariable(context, EWM_WT_SERIAL_MAP, serialNumberMap);
}

/**
 * Get the serial number map state variable
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 */
export function GetSerialNumberMap(context) {
    return libCom.getStateVariable(context, EWM_WT_SERIAL_MAP);
}

/**
 * get the count of the serial numbers
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @returns 
 */
export function GetSerialNumberCount(context) {
    const map = GetSerialNumberMap(context);
    return map ? map.length : 0;
}

/**
 * Select all serial numbers in the map
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @returns updated map
 */
export function SelectAllSerialNumberMap(context) {
    const map = GetSerialNumberMap(context);
    UpdateSerialNumberMap(context, map.map(element => { 
        element.selected = true; 
        return element; 
    }));
    return map;
}

/**
 * Return the selected or unselected icons
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context
 */
export function SelectUnselectIcon(context) {
    if (IsAndroid(context)) {
        return context.binding.selected ? '/SAPAssetManager/Images/Checkbox_selected.png' : '/SAPAssetManager/Images/Check.png';
    } else if (IsIOS(context)) {
        return context.binding.selected ? 'StepChecked' : 'Step';
    }
}

/**
 * Calculate the serial number scan caption
 * @param {IClientAPI} context 
 * @returns {String} caption
 */
export function GetSerialNumberScanCaption(context) {
    return context.localizeText('scan_serial_number', [GetQuantityToConfirmFromConfirmationPage(context) - GetSelectedCount(GetSerialNumberMap(context))]);
}

/**
 * Get SN's amount to confirm
 * @param {IClientAPI} context 
 * @returns {String} caption
 */
export function GetQuantityToConfirmFromConfirmationPage(context) {
    const pageName = `#Page:WarehouseTaskConfirmation${context.binding['@odata.type'].split('.')[1] === 'WarehouseTaskConfirmation' ? 'LocalEditPage' : ''}`;
    return parseFloat(context.getPageProxy().evaluateTargetPathForAPI(pageName).getControl('FormCellContainer').getControl('WhQuantitySimple').getValue());
}


/**
 * Calculate if serial number scan button is enabled
 * @param {IClientAPI} context 
 * @returns {Boolean} true if enabled
 */
export function GetSerialNumberScanEnabled(context) {
    const quantityToConfirm = GetQuantityToConfirmFromConfirmationPage(context);
    const selectedCount = GetSelectedCount(GetSerialNumberMap(context));
    return (quantityToConfirm - selectedCount) > 0;
}

/**
 * Update the controls on the page
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @param {Map} serialNumberMap 
 */
export function UpdateControls(context, serialNumberMap) {
    const quantitySerNum = parseInt(GetSelectedCount(serialNumberMap));
    const quantityToConfirm = parseInt(context.getPageProxy().evaluateTargetPath('#Page:-Previous/#Control:WhQuantitySimple').getValue());
    const quantity = quantityToConfirm - quantitySerNum;
    const sectTable = context.getPageProxy().getControl('SectionedTable');
    const scanButton = sectTable.getControl('ScanButton');
    scanButton.setTitle(context.localizeText('scan_serial_number', [quantity]));
    scanButton.setEnable(quantity > 0);
    sectTable.getControl('SerialNum').setEnable(quantity > 0);
    return Redraw(context);
}

/**
 * Get the selected count
  * @param {Map} serialNumberMap 
 */
export function GetSelectedCount(serialNumberMap) {
    return serialNumberMap.reduce((accumulator, currentValue) => accumulator + (currentValue.selected ? 1 : 0), 0);
}

/**
 * Get the unselected count
 * @param {Map} serialNumberMap 
 */
export function GetUnselectedCount(serialNumberMap) {
    return serialNumberMap.reduce((accumulator, currentValue) => accumulator + (currentValue.selected ? 0 : 1), 0);
}

/**
 * Redraw the sectioned table
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 */
export function Redraw(context) {
    return context
        .getPageProxy()
        .getControl('SectionedTable')
        .getSection(`${IsAndroid(context) ? 'SerialNumbersObjectTableAndroid' : 'SerialNumbersObjectTable'}`)
        .redraw();
}

/**
 * Get serial number assignment
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @param {Map} serialNumberMap 
 * @returns 
 */
export function SerialNumberAssignment(context, serialNumberMap) {
    const serialNum = [];
    serialNumberMap.forEach(element => {
        if (element.selected) {
            serialNum.push({
                TANUM: context.binding.WarehouseTask,
                SERID: element.entry.SerialNumber,
                DIFF: '',
            });
        }
    });
    return serialNum;
}
